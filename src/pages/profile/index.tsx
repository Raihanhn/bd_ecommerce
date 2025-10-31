"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Pencil, X } from "lucide-react";

type UserType = {
  name: string;
  email: string;
  mobile: string;
  address: string;
  image: string | File;
};

export default function ProfilePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [user, setUser] = useState<UserType>({
    name: "",
    email: "",
    mobile: "123***",
    address: "Your default address",
    image: "/default-avatar.png",
  });
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.email) {
      axios
        .get(`/api/profile/get?email=${session.user.email}`)
        .then((res) => {
          setUser((prev) => ({ ...prev, ...res.data.user }));
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setUser({ ...user, image: file });
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("email", user.email);
      formData.append("mobile", user.mobile);
      formData.append("address", user.address);

      if (user.image instanceof File) formData.append("image", user.image);

      await axios.post("/api/profile/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  const handlePasswordUpdate = async () => {
    if (!newPassword || !confirmPassword) {
      alert("Please fill in both password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      await axios.post("/api/profile/update-password", {
        email: user.email,
        newPassword,
      });
      alert("Password updated successfully!");
      setIsPasswordEditing(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      alert("Failed to update password.");
    }
  };

  if (loading) return <div className="text-center py-20 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#1e1f25] text-white flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-5xl bg-[#2b2d35] rounded-2xl shadow-2xl p-8 flex flex-col md:flex-row gap-10 border border-gray-700">
        {/* ===== Left Section ===== */}
        <div className="flex flex-col items-center w-full md:w-1/3 space-y-4">
          <div className="relative">
            <label htmlFor="imageUpload" className="cursor-pointer">
              <Image
                src={
                  preview ||
                  (typeof user.image === "string" ? user.image : "/default-avatar.png")
                }
                alt="Profile"
                width={150}
                height={150}
                className="rounded-full border-4 border-green-500 shadow-xl object-cover"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-sm">
                  Change
                </div>
              )}
            </label>
            {isEditing && (
              <input
                type="file"
                id="imageUpload"
                className="hidden"
                onChange={handleImage}
                accept="image/*"
              />
            )}
          </div>

          <h2 className="text-xl font-semibold">{user.name || "Your Name"}</h2>
          <p className="text-gray-400">@{user.email?.split("@")[0]}</p>

          {!isPasswordEditing ? (
            <button
  onClick={() => setIsPasswordEditing(true)}
  className="relative overflow-hidden rounded-lg px-6 py-2 font-semibold text-white cursor-pointer
             bg-gradient-to-r from-emerald-500 via-indigo-500 to-violet-500 transition-all hover:shadow-[0_0_15px_rgba(139,92,246,0.6)]"
>
  Change Password
</button>

          ) : (
            <div className="w-full space-y-3">
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#20222a] border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500 outline-none"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#20222a] border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500 outline-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handlePasswordUpdate}
                  className="bg-green-600 hover:bg-green-700 cursor-pointer px-4 py-2 rounded-lg font-semibold"
                >
                  Save Password
                </button>
                <button
                  onClick={() => setIsPasswordEditing(false)}
                  className="bg-gray-500 hover:bg-gray-600 cursor-pointer px-4 py-2 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

        <button className="bg-gradient-to-r from-rose-500 via-red-500 to-pink-600 hover:opacity-90 cursor-pointer px-6 py-2 rounded-lg font-semibold text-white transition">
  Logout
</button>


        </div>

        {/* ===== Right Section ===== */}
        <div className="flex-1 space-y-6">
          {/* Header + Edit/Save Buttons */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Personal Information</h1>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 cursor-pointer px-4 py-2 rounded-lg font-semibold"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-2 bg-gray-500 rounded-full hover:bg-gray-600"
                  >
                    <X size={18} />
                  </button>
                </>
              ) : (
                <button
  onClick={() => setIsEditing(true)}
  className="p-2 rounded-full cursor-pointer bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-500 hover:opacity-90 transition"
>
  <Pencil size={18} />
</button>
              )}
            </div>
          </div>

          {/* Info Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-gray-400 text-sm mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  className="w-full bg-[#20222a] border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500 outline-none"
                />
              ) : (
                <div className="bg-[#20222a] border border-gray-700 rounded-lg px-3 py-2">
                  {user.name}
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-400 text-sm mb-1">Email</label>
              <div className="bg-[#20222a] border border-gray-700 rounded-lg px-3 py-2 text-gray-300">
                {user.email}
              </div>
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-gray-400 text-sm mb-1">Mobile</label>
              {isEditing ? (
                <input
                  type="text"
                  name="mobile"
                  value={user.mobile}
                  onChange={handleChange}
                  className="w-full bg-[#20222a] border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500 outline-none"
                />
              ) : (
                <div className="bg-[#20222a] border border-gray-700 rounded-lg px-3 py-2">
                  {user.mobile}
                </div>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-gray-400 text-sm mb-1">Address</label>
              {isEditing ? (
                <textarea
                  name="address"
                  value={user.address}
                  onChange={handleChange}
                  className="w-full bg-[#20222a] border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500 outline-none"
                />
              ) : (
                <div className="bg-[#20222a] border border-gray-700 rounded-lg px-3 py-2">
                  {user.address}
                </div>
              )}
            </div>
          </div>

          {/* Edit Personal Info Button */}
          {!isEditing && (
            <div className="pt-4">
             <button
  onClick={() => setIsEditing(true)}
  className="bg-gradient-to-r from-cyan-400 via-emerald-500 to-indigo-500 hover:opacity-90 px-6 py-2 rounded-lg cursor-pointer font-semibold text-white transition"
>
  Edit Personal Information
</button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
