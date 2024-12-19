import axios from "axios";

const API_URL = "http://localhost:9000";


export const encodeSecret = async (
  imageFile, // Expecting a File object
  secretText,
  recieverEmail,
  senderEmail
) => {
  try {
    const formData = new FormData();

    // Check if imageFile is a URL or File object
    if (imageFile instanceof File) {
      // If it's a File object, append it directly to formData
      formData.append("image", imageFile);
    } else if (
      typeof imageFile === "string" &&
      imageFile.includes("/static/media/")
    ) {
      // If it's a static URL (like your example), fetch it and convert it into a File object
      const response = await fetch(imageFile);
      const blob = await response.blob();
      const file = new File([blob], "image.jpg", { type: blob.type });
      formData.append("image", file);
    }

    if (secretText) formData.append("st", secretText);
    if (recieverEmail) formData.append("recieverEmail", recieverEmail);
    if (senderEmail) formData.append("senderEmail", senderEmail);

    // Log FormData contents for debugging
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    // Send the formData using axios
    const response = await axios.post(`${API_URL}/encode`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      responseType: "arraybuffer", // Handle binary data response
    });

    return response.data; // Return the encoded image data buffer for further handling
  } catch (error) {
    console.error("Error encoding secret:", error);
  }
};



export const decodeSecret = async (image,email) => {
  try {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("recieverEmail", email);

    const response = await axios.post(`${API_URL}/decode`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response.data || "Error decoding secret";
  }
};

export const destroySecret = async (image, email) => {
  try {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("senderEmail", email);

    const response = await axios.post(`${API_URL}/destroy`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response.data || "Error decoding secret";
  }
};


export const mailReciever = async (imageBuffer,email) => {
  try {
    const formData = new FormData();
   if (imageBuffer) {
     const blob = new Blob([imageBuffer], { type: "image/jpeg" });
     formData.append("image", blob, "encoded_image.jpg");
   }
   if (email) {
     formData.append("email", email);
   }
    // Log the FormData to debug its contents before sending it
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    // Send the formData using axios
    const response = await axios.post(`${API_URL}/mailReciever`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      
    });

    // Handle the response to download the encoded image
    // if (response.data) {
    //   const contentType = response.headers["content-type"];
    //   const blob = new Blob([response.data], { type: contentType });
    //   const link = document.createElement("a");
    //   link.href = URL.createObjectURL(blob);
    //   link.download = "encoded_image.png"; // Use .png or .jpg depending on the type of image
    //   link.click(); // Trigger the download
    // }

      return response; // Return the image buffer for further handling
  } catch (error) {
    console.error("Error encoding secret:", error);
  }
};


export const mailRecieverSecret = async (secret, email) => {
  try {
    const formData = new FormData();
    
    console.log(secret);
    console.log(email);

   if (secret) {
     formData.append("secret", secret);
   }
   if (email) {
     formData.append("email", email);
   }

   // Log the FormData to debug its contents before sending it
   for (let pair of formData.entries()) {
     console.log(pair[0] + ": " + pair[1]);
   }

   try {
     // Send the formData using axios
     const response = await axios.post(
       `${API_URL}/mailRecieverSecret`,
       formData
     );

     console.log("Response:", response.data); // Log the response for further debugging
   } catch (error) {
     console.error("Error sending FormData:", error);
   }


    // Handle the response to download the encoded image
    // if (response.data) {
    //   const contentType = response.headers["content-type"];
    //   const blob = new Blob([response.data], { type: contentType });
    //   const link = document.createElement("a");
    //   link.href = URL.createObjectURL(blob);
    //   link.download = "encoded_image.png"; // Use .png or .jpg depending on the type of image
    //   link.click(); // Trigger the download
    // }

    
  } catch (error) {
    console.error("Error encoding secret:", error);
  }
};

