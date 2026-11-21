
async function checkTeacherAccess() {
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

    if (profileError || !profile ||
        !["teacher", "admin"].includes(profile.role)) {
        window.location.replace("student.html");
        return;
    }

    document.body.style.display = "";
}

document.body.style.display = "none";
checkTeacherAccess();

document.getElementById("logout-button").addEventListener("click", async function(event) {
  event.preventDefault();

  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    alert("Ошибка выхода: " + error.message);
    return;
  }

  window.location.replace("login.html");
});
