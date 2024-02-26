import { useState, useRef } from "react";
import { FaCamera } from "react-icons/fa";
import { UpdateAvatar } from "../../Api/User";

function UpdateProfilePhoto() {
  const [avatar, setAvatar] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);

      await UpdateAvatar(file);
    }
  };

  const handleProfilePhotoClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex justify-center w-full h-96">
      <div className="mt-2">
        <input
          ref={fileInputRef}
          name="avatar"
          id="avatar"
          className="hidden"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      <div
        className="flex justify-center bg-violet-500 w-96 h-80 p-5 relative rounded-lg shadow-lg shadow-gray-400"
        onClick={handleProfilePhotoClick}
      >
        {/* Display selected avatar image */}
        <img
          className="inline-block h-48 w-48 rounded-full shadow-lg shadow-cyan-500/50 cursor-pointer"
          src={avatar || "https://via.placeholder.com/150"}
          alt="Avatar"
        />
        <FaCamera className="absolute bottom-8 right-8 w-8 h-8 text-gray-300 cursor-pointer" />
      </div>
    </div>
  );
}

export default UpdateProfilePhoto;
