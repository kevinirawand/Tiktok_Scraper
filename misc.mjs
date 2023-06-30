this.page.on('response', async (response) => {
   if (response.url().includes(`https://www.instagram.com/api/v1/users/web_profile_info/`)) {
      try {
         const newRespon = await response.json();
         resolve(newRespon);
      } catch (error) {
         console.log("NOT JSON Format");
      }
   }
});