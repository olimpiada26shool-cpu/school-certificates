
async function checkStudentAccess() {
    try {
        const { data: { user }, error } =
            await supabaseClient.auth.getUser();

        if (error || !user) {
            window.location.replace("login.html");
            return;
        }

        const { data: profile, error: profileError } =
            await supabaseClient
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single();

        if (profileError || !profile) {
            window.location.replace("login.html");
            return;
        }

        if (profile.role !== "student") {
            window.location.replace("teacher.html");
            return;
        }

        document.body.style.display = "";
    } catch (error) {
        console.error("Ошибка проверки доступа:", error);
        window.location.replace("login.html");
    }
}

document.body.style.display = "none";
checkStudentAccess();

document.getElementById("logout-button").addEventListener("click", async function(event) {
  event.preventDefault();

  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    alert("Ошибка выхода: " + error.message);
    return;
  }

  window.location.replace("login.html");
});
