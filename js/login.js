
const loginForm = document.querySelector("form");

loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.querySelector('input[type="email"]').value.trim();
    const password = document.querySelector('input[type="password"]').value;

    if (!email || !password) {
        alert("Заполните все поля!");
        return;
    }

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        alert("Ошибка входа: " + error.message);
        return;
    }

    const { data: profile, error: profileError } = await supabaseClient
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

    if (profileError || !profile) {
        await supabaseClient.auth.signOut();
        alert("Не удалось определить роль пользователя.");
        return;
    }

    if (profile.role === "student") {
        window.location.href = "student.html";
    } else if (profile.role === "teacher" || profile.role === "admin") {
        window.location.href = "teacher.html";
    } else {
        await supabaseClient.auth.signOut();
        alert("Неизвестная роль пользователя.");
    }
});
