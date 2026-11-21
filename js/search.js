
const subjectFilter = document.getElementById("subject");
const yearFilter = document.getElementById("year");
const typeFilter = document.getElementById("achievement");
const olympiadFilter = document.getElementById("olympiad");
const certificatesList = document.getElementById("certificates-list");

function searchCertificates() {
    const results = certificates.filter(function(item) {
        return (
            (subjectFilter.value === "Все предметы" || item.subject === subjectFilter.value) &&
            (yearFilter.value === "Все годы" || item.year === yearFilter.value) &&
            (typeFilter.value === "Все достижения" || item.type === typeFilter.value) &&
            (olympiadFilter.value === "Все олимпиады" || item.olympiad === olympiadFilter.value)
        );
    });

    certificatesList.innerHTML = "";

    if (results.length === 0) {
        certificatesList.textContent = "Грамоты не найдены.";
        return;
    }

    results.forEach(function(item) {
        const card = document.createElement("div");
        card.className = "certificate-card";

        const title = document.createElement("h4");
        title.textContent = item.name;
        card.appendChild(title);

        [
            "Предмет: " + item.subject,
            "Год: " + item.year,
            "Олимпиада: " + item.olympiad,
            "Тип: " + item.type
        ].forEach(function(line) {
            const p = document.createElement("p");
            p.textContent = line;
            card.appendChild(p);
        });
        const openButton = document.createElement("button");
openButton.textContent = "📄 Открыть PDF";

openButton.addEventListener("click", async function () {
    const { data, error } = await supabaseClient.storage
        .from("certificates")
        .createSignedUrl(item.file_path, 60);

    if (error || !data?.signedUrl) {
        alert("Не удалось открыть PDF: " + (error?.message || "Нет ссылки"));
        return;
    }

    window.open(data.signedUrl, "_blank");
});

card.appendChild(openButton);

        certificatesList.appendChild(card);
    });
}

subjectFilter.addEventListener("change", searchCertificates);
yearFilter.addEventListener("change", searchCertificates);
typeFilter.addEventListener("change", searchCertificates);
olympiadFilter.addEventListener("change", searchCertificates);
