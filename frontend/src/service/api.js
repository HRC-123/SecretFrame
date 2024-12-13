import axios from "axios";

const API_URL = "http://localhost:9000";



export const encodeSecret = async (
  imageFile,
  secretText,
  email,
  senderEmail
) => {
  try {
    const formData = new FormData();

    // Append form data only if the values are present
    if (imageFile) formData.append("image", imageFile); // Image file
    if (secretText) formData.append("st", secretText); // Secret text
    if (email) formData.append("email", email); // Receiver's email
    if (senderEmail) formData.append("senderEmail", senderEmail); // Sender's email

    // Log the FormData to debug its contents before sending it
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    // Send the formData using axios
    const response = await axios.post(`${API_URL}/encode`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      responseType: "arraybuffer", // Set the response type to handle binary data
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

    return response.data; // Return the image buffer for further handling
  } catch (error) {
    console.error("Error encoding secret:", error);
  }
};


export const decodeSecret = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/decode`, data);
    return response.data;
  } catch (error) {
    throw error.response.data || "Error decoding secret";
  }
};

export const destroySecret = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/destroy`, data);
    return response.data;
  } catch (error) {
    throw error.response.data || "Error destroying secret";
    }
};


export const mailReciever = async (imageFile,email) => {
  try {
    const formData = new FormData();

    // Append form data only if the values are present
    if (imageFile) formData.append("image", imageFile); // Image file
    if (email) formData.append("email", email); // Receiver's email

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
