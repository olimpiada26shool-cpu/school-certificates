const form = document.getElementById("certificate-form");

form.addEventListener("submit", async function(event) {
    event.preventDefault();
        const inputs = form.querySelectorAll("input");

        const studentName = inputs[0].value;
        const subject = inputs[1].value;
        const olympiad = inputs[2].value;
        const year = inputs[3].value;
        const file = inputs[4].files[0];
        const type = "Грамота";

        if (!studentName || !subject || !olympiad || !year || !file) {
            alert("Заполните все поля и выберите PDF-файл!");
            return;
        }

        if (file.type !== "application/pdf") {
            alert("Пожалуйста, выберите PDF-файл!");
            return;
        }

        const { data: { user }, error: userError } =
    await supabaseClient.auth.getUser();

if (userError || !user) {
    alert("Для загрузки грамоты необходимо войти в аккаунт.");
    return;
}
const { data: students, error: studentError } =
    await supabaseClient
        .from("profiles")
        .select("id, full_name")
        .eq("full_name", studentName.trim())
        .eq("role", "student")
        .limit(2);

if (studentError) {
    alert("Ошибка поиска ученика: " + studentError.message);
    return;
}

if (!students || students.length !== 1) {
    alert("Ученик не найден или найдено несколько совпадений.");
    return;
}

const studentId = students[0].id;
const filePath = `${studentId}/${crypto.randomUUID()}.pdf`;
const { error: uploadError } = await supabaseClient.storage
    .from("certificates")
    .upload(filePath, file, {
        contentType: "application/pdf",
        upsert: false
    });

if (uploadError) {
    alert("Ошибка загрузки PDF: " + uploadError.message);
    return;
}

const { error: saveError } = await supabaseClient
    .from("certificates")
    .insert({
        student_id: studentId,
        title: type,
        subject: subject,
        olympiad: olympiad,
        year: Number(year),
        type: type,
        file_path: filePath,
        uploaded_by: user.id
    });

if (saveError) {
    alert("PDF загружен, но запись не сохранена: " + saveError.message);
    return;
}

alert("Грамота успешно добавлена!");
form.reset();

});