import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Navigate } from 'react-router-dom';
import { Loader2, User, MapPin } from 'lucide-react';
import { LocationSelect } from '@/components/ui/location-select';
import {
  useCountries,
  useStates,
  useCities,
  useLocationById,
  useLocationByAddress,
} from '@/hooks/useLocations';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  country: z.string().min(2, 'Country is required').max(100),
  state: z.string().min(2, 'State is required').max(100),
  city: z.string().min(2, 'City is required').max(100),
  household_size: z.coerce.number().min(1).max(20).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Profile() {
  const { authUser, profile, userData, loading } = useAuth();
  const { updateProfile, updateUser } = useProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: currentLocation } = useLocationById(userData?.location_id);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name ?? '',
      country: '',
      state: '',
      city: '',
      household_size: userData?.household_size ?? 1,
    },
  });

  const watchCountry = form.watch('country');
  const watchState = form.watch('state');

  const { data: countries, isLoading: countriesLoading } = useCountries();
  const { data: states, isLoading: statesLoading } = useStates(
    watchCountry || undefined
  );
  const { data: cities, isLoading: citiesLoading } = useCities(
    watchCountry || undefined,
    watchState || undefined
  );
  const { data: selectedLocation } = useLocationByAddress(
    form.watch('country'),
    form.watch('state'),
    form.watch('city')
  );

  // Initialize form values from user data
  useEffect(() => {
    if (currentLocation) {
      form.setValue('country', currentLocation.country);
      form.setValue('state', currentLocation.state);
      form.setValue('city', currentLocation.city);
    }
    if (profile?.name) form.setValue('name', profile.name);
    if (userData?.household_size)
      form.setValue('household_size', userData.household_size);
  }, [currentLocation, profile, userData, form]);

  const handleCountryChange = (value: string) => {
    form.setValue('country', value);
    form.setValue('state', '');
    form.setValue('city', '');
  };

  const handleStateChange = (value: string) => {
    form.setValue('state', value);
    form.setValue('city', '');
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!selectedLocation) return;

    setIsSubmitting(true);
    try {
      await updateProfile.mutateAsync({ name: data.name });
      await updateUser.mutateAsync({
        location_id: selectedLocation.id,
        household_size: data.household_size,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!authUser) return <Navigate to="/auth" replace />;
  if (!userData) return <Navigate to="/dashboard" replace />;

  const getInitials = () => {
    const name =
      profile?.name || authUser.user_metadata?.full_name || authUser.email;
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Layout>
      <div className="container py-8 max-w-2xl space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Profile Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and location settings
          </p>
        </div>

        {/* Account Info */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <User className="h-5 w-5" /> Account
            </CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={authUser.user_metadata?.avatar_url}
                alt={authUser.email || ''}
              />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-medium">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">
                {profile?.name || authUser.user_metadata?.full_name || 'User'}
              </p>
              <p className="text-sm text-muted-foreground">{authUser.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Profile & Location Settings */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" /> Profile & Location
            </CardTitle>
            <CardDescription>
              Update your profile and location for accurate community insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <LocationSelect
                          value={field.value}
                          onValueChange={handleCountryChange}
                          placeholder="Select country"
                          options={countries || []}
                          isLoading={countriesLoading}
                          emptyMessage="No countries available"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <LocationSelect
                          value={field.value}
                          onValueChange={handleStateChange}
                          placeholder="Select state"
                          options={states || []}
                          isLoading={statesLoading}
                          disabled={!watchCountry}
                          emptyMessage={
                            watchCountry
                              ? 'No states available'
                              : 'Select a country first'
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <LocationSelect
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select city"
                          options={cities || []}
                          isLoading={citiesLoading}
                          disabled={!watchState}
                          emptyMessage={
                            watchState
                              ? 'No cities available'
                              : 'Select a state first'
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        This helps us provide localized insights
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="household_size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Household Size</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} max={20} {...field} />
                      </FormControl>
                      <FormDescription>
                        Number of people in your household
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting || !selectedLocation}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
