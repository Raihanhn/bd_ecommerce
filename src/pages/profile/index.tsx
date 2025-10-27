"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react"; 
import axios from "axios";

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
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">My Profile</h1>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          <label htmlFor="imageUpload" className="cursor-pointer">
            <Image
              src={preview || (typeof user.image === "string" ? user.image : "/default-avatar.png")}
              alt="Profile"
              width={120}
              height={120}
              className="rounded-full border-4 border-blue-500 shadow-md"
            />
          </label>
          <input
            type="file"
            id="imageUpload"
            className="hidden"
            onChange={handleImage}
            accept="image/*"
          />
        </div>

        {/* Name */}
        <label className="block text-gray-700 font-medium mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 mb-4"
        />

        {/* Email */}
        <label className="block text-gray-700 font-medium mb-1">Email</label>
        <input
          type="text"
          name="email"
          value={user.email}
          readOnly
          className="w-full border rounded-lg px-3 py-2 mb-4 bg-gray-100 cursor-not-allowed"
        />

        {/* Mobile */}
        <label className="block text-gray-700 font-medium mb-1">Mobile</label>
        <input
          type="text"
          name="mobile"
          value={user.mobile}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 mb-4"
        />

        {/* Address */}
        <label className="block text-gray-700 font-medium mb-1">Address</label>
        <textarea
          name="address"
          value={user.address}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 mb-6"
        ></textarea>

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
