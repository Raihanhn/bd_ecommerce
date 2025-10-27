"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Pencil, Save, X } from "lucide-react";

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
  const [user, setUser] = useState<UserType>({
    name: "",
    email: "",
    mobile: "123***",
    address: "Your default address",
    image: "/default-avatar.png",
  });
  const [preview, setPreview] = useState<string | null>(null);

  // Fetch user data
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

      if (user.image instanceof File) {
        formData.append("image", user.image);
      }

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

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center py-10">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md relative transition-all duration-300">
        {/* Edit / Save Buttons */}
        <div className="absolute top-6 right-6 flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700"
                title="Save"
              >
                <Save size={18} />
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400"
                title="Cancel"
              >
                <X size={18} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
              title="Edit Profile"
            >
              <Pencil size={18} />
            </button>
          )}
        </div>

        {/* Header */}
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
          My Profile
        </h1>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          <label htmlFor="imageUpload" className="cursor-pointer relative">
            <Image
              src={
                preview ||
                (typeof user.image === "string"
                  ? user.image
                  : "/default-avatar.png")
              }
              alt="Profile"
              width={120}
              height={120}
              className="rounded-full border-4 border-blue-500 shadow-lg object-cover"
            />
            {isEditing && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                <span className="text-white text-sm">Change</span>
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

        {/* Details */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Name</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            ) : (
              <p className="text-gray-800 border rounded-lg px-3 py-2 bg-gray-50">
                {user.name || "No name added"}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email</label>
            <p className="text-gray-800 border rounded-lg px-3 py-2 bg-gray-100">
              {user.email}
            </p>
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Mobile</label>
            {isEditing ? (
              <input
                type="text"
                name="mobile"
                value={user.mobile}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            ) : (
              <p className="text-gray-800 border rounded-lg px-3 py-2 bg-gray-50">
                {user.mobile}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Address</label>
            {isEditing ? (
              <textarea
                name="address"
                value={user.address}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              ></textarea>
            ) : (
              <p className="text-gray-800 border rounded-lg px-3 py-2 bg-gray-50">
                {user.address}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
