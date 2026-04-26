import { Edit3, Upload, MapPin } from "lucide-react";
import { PageTransition } from "../components/PageTransition";
import { useAppStore } from "../store/useAppStore";
import { useState, useRef, ChangeEvent } from "react";
import { toast } from "sonner";

export function Profile() {
  const { userName, setUserName, profilePhoto, setProfilePhoto, currentUserEmail, emailNotifications, setEmailNotifications, profileVisibility, setProfileVisibility, bio, setBio, location, setLocation } = useAppStore();
  const [nameInput, setNameInput] = useState(userName);
  const [bioInput, setBioInput] = useState(bio);
  const [locationInput, setLocationInput] = useState(location);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image too large. Please select an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
        toast.success("Profile photo updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (nameInput.trim() !== "") {
      setUserName(nameInput);
      setBio(bioInput);
      setLocation(locationInput);
      toast.success("Profile updated successfully!");
    }
  };

  const currentPhoto = profilePhoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300";

  return (
    <PageTransition>
      <div className="space-y-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-8">Profile Details</h1>

        <div className="overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-sm shadow-gray-200/50 dark:shadow-none ring-1 ring-gray-100 dark:ring-gray-700/50">
          <div className="h-32 sm:h-48 relative bg-gradient-to-b from-[#DCFCE7] to-white dark:from-emerald-900/30 dark:to-gray-800 overflow-hidden">
             {/* Subtle abstract shapes */}
             <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-400/20 dark:bg-emerald-600/10 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl" />
             <div className="absolute top-0 -right-4 w-56 h-56 bg-emerald-300/20 dark:bg-emerald-500/10 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl" />
             <div className="absolute -bottom-8 left-1/2 w-48 h-48 bg-emerald-200/30 dark:bg-emerald-700/10 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl -translate-x-1/2" />
             
             {/* Subtle leaf pattern overlay (Opacity 5-10%) */}
             <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxNicgaGVpZ2h0PScxNic+CjxwYXRoIGQ9J004LjAxIDNjLS4xIDAtLjIuMDItLjMuMDQtMy40Ni42LTUuOTYgMy4zMi02LjcxIDYuNi0uMS40Ni4yMi44OS42Ny45LjM1LjAxLjYzLS4yLjcyLS41My41Ny0yLjE4IDIuMi0zLjk3IDQuMzYtNC41QzcuMTQgNi4xMiA2LjEgOC41IDYuMSA4LjVjMCAzLjMxIDIuNjkgNiA2IDZzNi0yLjY5IDYtNmMwLTIuNTgtMS42NC00Ljc5LTQuMDItNS42LjExLjQzLjE4Ljg3LjE4IDEuMyAwIDIuOTQtMi4zOSA1LjMzLTUuMzMgNS4zMy0xLjEzIDAtMi4xNi0uMzUtMy4wMi0uOTRDNi45IDkuNjMgNy45NCA4IDguMDEgM3onIGZpbGw9J2N1cnJlbnRDb2xvcicgZmlsbC1vcGFjaXR5PScwLjE1Jy8+Cjwvc3ZnPg==')] opacity-30 dark:opacity-10" />
          </div>
          
          <div className="px-6 pb-8 pt-0 relative z-10 flex flex-col items-center">
            <div className="mt-[-48px] sm:mt-[-56px] relative group">
              <img src={currentPhoto} alt="Profile" className="h-28 w-28 sm:h-32 sm:w-32 rounded-full object-cover ring-[4px] ring-white dark:ring-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-none bg-white dark:bg-gray-800 transition-transform duration-300 ease-out group-hover:scale-105 cursor-pointer" crossOrigin="anonymous" onClick={() => fileInputRef.current?.click()} />
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute right-0 bottom-1 sm:bottom-2 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm ring-2 ring-white dark:ring-gray-800 hover:bg-emerald-700 hover:scale-110 transition-all duration-200"
                title="Upload Photo"
              >
                 <Upload className="h-4 w-4 drop-shadow-sm" />
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{userName}</h2>
              <div className="flex items-center justify-center gap-3 mt-1.5">
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider">Sustainability Learner</p>
                {location && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {location}
                    </p>
                  </>
                )}
              </div>
            </div>
            
            <div className="w-full mt-8 sm:mt-12 grid gap-8 sm:grid-cols-2 text-left border-t border-gray-100 dark:border-gray-800/60 pt-8">
              <div className="space-y-4">
                 <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Account Information</h3>
                 <div className="grid gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</label>
                      <input 
                        type="text" 
                        value={nameInput} 
                        onChange={(e) => setNameInput(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-gray-100 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-500 dark:text-gray-400">Bio</label>
                      <textarea 
                        value={bioInput} 
                        onChange={(e) => setBioInput(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-gray-100 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800 resize-none h-24"
                        placeholder="Tell us a bit about yourself"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-500 dark:text-gray-400">Location</label>
                      <input 
                        type="text" 
                        value={locationInput} 
                        onChange={(e) => setLocationInput(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-gray-100 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800"
                        placeholder="City, Country"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[13px] font-bold text-gray-600 dark:text-gray-300">Email Address</label>
                      <input type="email" value={currentUserEmail || "student@example.com"} disabled className="w-full bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-500 dark:text-gray-400 outline-none transition-all" />
                    </div>
                    <div className="pt-2">
                      <button 
                        onClick={handleSave}
                        className="w-full rounded-xl border border-transparent bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-600/30 transition-all hover:bg-emerald-700 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        Save Changes
                      </button>
                    </div>
                 </div>
              </div>

              <div className="space-y-5">
                 <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Preferences</h3>
                 <div className="space-y-3">
                    <label className="group flex items-start gap-4 rounded-xl border border-gray-100 dark:border-gray-800 p-4 transition-all duration-200 hover:bg-gray-50 dark:bg-gray-900 hover:border-emerald-200 cursor-pointer text-gray-900 dark:text-gray-100 shadow-sm shadow-transparent hover:shadow-gray-200/50">
                       <input type="checkbox" checked={emailNotifications} onChange={(e) => { setEmailNotifications(e.target.checked); toast.success("Preferences updated!"); }} className="mt-1 h-4.5 w-4.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600 transition-shadow" />
                       <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-emerald-800 transition-colors">Email Notifications</p>
                          <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400 mt-0.5">Receive updates on new modules and certificates.</p>
                       </div>
                    </label>
                    <label className="group flex items-start gap-4 rounded-xl border border-gray-100 dark:border-gray-800 p-4 transition-all duration-200 hover:bg-gray-50 dark:bg-gray-900 hover:border-emerald-200 cursor-pointer text-gray-900 dark:text-gray-100 shadow-sm shadow-transparent hover:shadow-gray-200/50">
                       <input type="checkbox" checked={profileVisibility} onChange={(e) => { setProfileVisibility(e.target.checked); toast.success("Preferences updated!"); }} className="mt-1 h-4.5 w-4.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600 transition-shadow" />
                       <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-emerald-800 transition-colors">Profile Visibility</p>
                          <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400 mt-0.5">Allow others to see your earned certificates.</p>
                       </div>
                    </label>
                 </div>
                 
                 <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-8 pt-6 border-t border-gray-100 dark:border-gray-800/60">Account Security</h3>
                 <div className="space-y-3">
                   <button 
                     onClick={() => toast.success("Password reset email sent")}
                     className="w-full flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 shadow-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600"
                   >
                     <span>Change Password</span>
                     <span className="text-gray-400">&rarr;</span>
                   </button>
                   <button 
                     onClick={() => toast.error("Please contact support to delete your account")}
                     className="w-full flex items-center justify-between rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 shadow-sm transition-all hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-800"
                   >
                     <span>Delete Account</span>
                     <span className="text-red-400/50">&rarr;</span>
                   </button>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
