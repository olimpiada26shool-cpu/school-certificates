let certificates = [];

async function loadCertificates() {
    const { data: { user }, error: userError } =
        await supabaseClient.auth.getUser();

    if (userError || !user) {
        document.getElementById("certificates-list").textContent =
            "Войдите в аккаунт, чтобы увидеть свои грамоты.";
        return;
    }

    const { data, error } = await supabaseClient
        .from("certificates")
        .select("title, subject, year, olympiad, type, file_path")
        .eq("student_id", user.id);

    if (error) {
        console.error(error);
        document.getElementById("certificates-list").textContent =
            "Ошибка загрузки грамот.";
        return;
    }

    certificates = (data || []).map(item => ({
        name: item.title,
        subject: item.subject,
        year: String(item.year),
        olympiad: item.olympiad,
        type: item.type,
        file_path: item.file_path
    }));

    searchCertificates();
}

loadCertificates();