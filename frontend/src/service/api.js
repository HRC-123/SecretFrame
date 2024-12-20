import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;


export const encodeSecret = async (
  imageFile, 
  secretText,
  recieverEmail,
  senderEmail
) => {

  console.log(API_URL);
  try {
    const formData = new FormData();

   
    if (imageFile instanceof File) {
      
      formData.append("image", imageFile);
    } else if (
      typeof imageFile === "string" &&
      imageFile.includes("/static/media/")
    ) {
      
      const response = await fetch(imageFile);
      const blob = await response.blob();
      const file = new File([blob], "image.jpg", { type: blob.type });
      formData.append("image", file);
    }

    if (secretText) formData.append("st", secretText);
    if (recieverEmail) formData.append("recieverEmail", recieverEmail);
    if (senderEmail) formData.append("senderEmail", senderEmail);

    
    // for (let pair of formData.entries()) {
    //   console.log(pair[0] + ": " + pair[1]);
    // }


    const response = await axios.post(`${API_URL}/encode`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      responseType: "arraybuffer", 
    });

    return response.data; 
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

    // console.log(response.data);
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

    // console.log(response.data);
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
  
    // for (let pair of formData.entries()) {
    //   console.log(pair[0] + ": " + pair[1]);
    // }


    const response = await axios.post(`${API_URL}/mailReciever`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      
    });


      return response; 
  } catch (error) {
    console.error("Error encoding secret:", error);
  }
};


export const mailRecieverSecret = async (secret, email) => {
  try {
    const formData = new FormData();
    
    // console.log(secret);
    // console.log(email);

   if (secret) {
     formData.append("secret", secret);
   }
   if (email) {
     formData.append("email", email);
   }

  //  for (let pair of formData.entries()) {
  //    console.log(pair[0] + ": " + pair[1]);
  //  }

   try {
    
     const response = await axios.post(
       `${API_URL}/mailRecieverSecret`,
       formData
     );

     //  console.log("Response:", response.data); 
     return response.data;
   } catch (error) {
     console.error("Error sending FormData:", error);
   }

    
  } catch (error) {
    console.error("Error encoding secret:", error);
  }
};

