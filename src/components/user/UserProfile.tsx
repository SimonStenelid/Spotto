import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import { Dialog, DialogContent } from "../../components/ui/dialog";
import { ProfilePictureUpload } from "../../components/ui/ProfilePictureUpload";
import { 
  Pencil, 
  MapPin, 
  Mail, 
  Phone, 
  Building2, 
  Globe,
  Check,
  X,
  Loader2
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../../components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { ScrollArea } from "../../components/ui/scroll-area";
import type { User } from '../../types';
import { supabase } from '../../lib/supabase';
import { useToast } from "../../components/ui/use-toast";

interface Country {
  value: string;
  label: string;
  flag: string;
}

// List of countries for the selector
const countries = [
  { value: 'GB', label: 'United Kingdom', flag: '🇬🇧' },
  { value: 'US', label: 'United States', flag: '🇺🇸' },
  { value: 'CA', label: 'Canada', flag: '🇨🇦' },
  { value: 'AU', label: 'Australia', flag: '🇦🇺' },
  { value: 'NZ', label: 'New Zealand', flag: '🇳🇿' },
  { value: 'IE', label: 'Ireland', flag: '🇮🇪' },
  { value: 'FR', label: 'France', flag: '🇫🇷' },
  { value: 'DE', label: 'Germany', flag: '🇩🇪' },
  { value: 'IT', label: 'Italy', flag: '🇮🇹' },
  { value: 'ES', label: 'Spain', flag: '🇪🇸' },
  { value: 'PT', label: 'Portugal', flag: '🇵🇹' },
  { value: 'NL', label: 'Netherlands', flag: '🇳🇱' },
  { value: 'BE', label: 'Belgium', flag: '🇧🇪' },
  { value: 'CH', label: 'Switzerland', flag: '🇨🇭' },
  { value: 'AT', label: 'Austria', flag: '🇦🇹' },
  { value: 'SE', label: 'Sweden', flag: '🇸🇪' },
  { value: 'NO', label: 'Norway', flag: '🇳🇴' },
  { value: 'DK', label: 'Denmark', flag: '🇩🇰' },
  { value: 'FI', label: 'Finland', flag: '🇫🇮' },
  { value: 'JP', label: 'Japan', flag: '🇯🇵' },
] as const;

const UserProfile: React.FC = () => {
  const { user, signOut, updateUser, membership } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(user);
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { toast } = useToast();

  // Initialize selected country from user data
  useEffect(() => {
    if (user?.country) {
      const userCountry = countries.find(c => c.value === user.country);
      if (userCountry) {
        setSelectedCountry(userCountry);
      }
    }
  }, [user?.country]);

  // Initialize edited user when user data changes
  useEffect(() => {
    if (user) {
      setEditedUser(user);
      if (user.country) {
        const userCountry = countries.find(c => c.value === user.country);
        if (userCountry) {
          setSelectedCountry(userCountry);
        }
      }
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <h2 className="text-xl font-bold mb-4">You're not logged in</h2>
        <Button asChild>
          <Link to="/login">Log in</Link>
        </Button>
      </div>
    );
  }

  const handleSave = async () => {
    if (!editedUser || !user.id) return;
    
    try {
      setIsSaving(true);

      // Update the profile in Supabase
      const { data: profile, error } = await supabase
        .from('profiles')
        .update({
          username: editedUser.username,
          first_name: editedUser.firstName,
          last_name: editedUser.lastName,
          phone: editedUser.phone,
          city: editedUser.city,
          postal_code: editedUser.postalCode,
          country: selectedCountry?.value,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Transform the profile data to match our User type
      const updatedUser: User = {
        ...user,
        username: profile.username,
        firstName: profile.first_name,
        lastName: profile.last_name,
        phone: profile.phone,
        city: profile.city,
        postalCode: profile.postal_code,
        country: profile.country,
        updatedAt: profile.updated_at,
        bookmarks: profile.bookmarks || [],
        visitedPlaces: profile.visited_places || [],
        avatar: profile.avatar,
        email: profile.email,
        createdAt: profile.created_at
      };

      // Update both local state and global auth state
      setEditedUser(updatedUser);
      updateUser(updatedUser);

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    if (user.country) {
      const userCountry = countries.find(c => c.value === user.country);
      if (userCountry) {
        setSelectedCountry(userCountry);
      }
    }
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof User, value: string) => {
    if (!editedUser) return;
    setEditedUser({ 
      ...editedUser, 
      [field]: value 
    });
  };

  return (
    <motion.div
      className="w-full max-w-full px-2 sm:px-4 md:max-w-4xl mx-auto py-4 md:py-8 max-h-screen overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Card className="bg-white shadow-sm w-full">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between flex-col gap-4 sm:flex-row sm:gap-0">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-center sm:text-left">Account Manager</h1>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                membership === 'paid' 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-orange-100 text-orange-800 border border-orange-200'
              }`}>
                {membership === 'paid' ? 'Member' : 'Preview'}
              </div>
            </div>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="w-full sm:w-auto">
                <Pencil className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="w-1/2 sm:w-auto"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-1/2 sm:w-auto"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4 mr-2" />
                  )}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Profile Section */}
          <div className="flex flex-col items-center space-y-4 md:flex-row md:items-start md:space-x-6 md:space-y-0 pt-6">
            <div className="relative flex-shrink-0">
              <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
                <AvatarImage src={user.avatar || undefined} className="object-cover" />
                <AvatarFallback className="text-3xl sm:text-4xl">
                  {user.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
                  onClick={() => setIsUploadOpen(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <DialogContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <h2 className="text-lg font-semibold text-gray-900">Update Profile Picture</h2>
                      <p className="text-sm text-gray-500">Upload a new profile picture</p>
                    </div>
                    <ProfilePictureUpload onClose={() => setIsUploadOpen(false)} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex-1 w-full text-center md:text-left">
              <h2 className="text-xl font-semibold break-words">{user.username}</h2>
              <p className="flex items-center justify-center md:justify-start text-sm text-muted-foreground mt-2">
                <MapPin className="h-4 w-4 mr-1" />
                {selectedCountry?.label}
              </p>
            </div>
          </div>

          <Separator />

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  value={isEditing ? editedUser?.firstName || '' : user.firstName || ''} 
                  readOnly={!isEditing}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  value={isEditing ? editedUser?.lastName || '' : user.lastName || ''} 
                  readOnly={!isEditing}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    value={user.email || ''} 
                    readOnly
                    disabled
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="phone" 
                    value={isEditing ? editedUser?.phone || '' : user.phone || ''} 
                    readOnly={!isEditing}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Address</h3>
            <div className="grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                      disabled={!isEditing}
                    >
                      {selectedCountry ? (
                        <>
                          <span className="mr-2">{selectedCountry.flag}</span>
                          {selectedCountry.label}
                        </>
                      ) : (
                        "Select country..."
                      )}
                      <Globe className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search country..." />
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup>
                        <ScrollArea className="h-64">
                          {countries.map((country) => (
                            <CommandItem
                              key={country.value}
                              value={country.label}
                              onSelect={() => {
                                setSelectedCountry(country);
                                setOpen(false);
                              }}
                            >
                              <span className="mr-2">{country.flag}</span>
                              {country.label}
                            </CommandItem>
                          ))}
                        </ScrollArea>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City/State</Label>
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="city" 
                    value={isEditing ? editedUser?.city || '' : user.city || ''} 
                    readOnly={!isEditing}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input 
                  id="postalCode" 
                  value={isEditing ? editedUser?.postalCode || '' : user.postalCode || ''} 
                  readOnly={!isEditing}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Account Actions */}
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:space-x-4 pt-4">
            <Button variant="outline" onClick={() => signOut()} className="w-full sm:w-auto">
              Sign Out
            </Button>
            <Button variant="destructive" className="w-full sm:w-auto">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserProfile;