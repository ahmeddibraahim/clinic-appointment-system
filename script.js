// ===== MODAL DATA =====
const servicesData = {
  general: {
    icon: "🩺",
    title: "الكشف العام",
    desc: "فحص طبي شامل يهدف إلى تقييم الحالة الصحية العامة للمريض والكشف المبكر عن أي مشاكل صحية محتملة.",
    points: [
      "قياس ضغط الدم ومعدل ضربات القلب",
      "فحص الجهاز التنفسي والهضمي",
      "تقرير طبي مكتوب ومفصل",
      "مدة الكشف: 30 دقيقة تقريباً",
      "متاح للكبار والأطفال",
    ],
  },
  heart: {
    icon: "❤️",
    title: "أمراض القلب",
    desc: "تشخيص ومتابعة وعلاج جميع أمراض القلب والأوعية الدموية باستخدام أحدث الأجهزة الطبية.",
    points: [
      "رسم قلب (ECG) وتحليل النتائج",
      "إيكو قلب (Echocardiography)",
      "تشخيص ارتفاع ضغط الدم وعلاجه",
      "متابعة مرضى القلب المزمنين",
      "إحالة فورية للطوارئ عند الحاجة",
    ],
  },
  lab: {
    icon: "🔬",
    title: "تحاليل مخبرية",
    desc: "نوفر تحاليل دقيقة وسريعة بأحدث الأجهزة المعتمدة لمساعدة الطبيب في التشخيص الصحيح.",
    points: [
      "تحليل صورة الدم الكاملة (CBC)",
      "تحاليل السكر والكوليسترول",
      "وظائف الكبد والكلى",
      "تحاليل فيروس C والبروتينات",
      "النتائج خلال ساعات في نفس اليوم",
    ],
  },
  chronic: {
    icon: "📋",
    title: "متابعة الأمراض المزمنة",
    desc: "برنامج متكامل لمتابعة المرضى الذين يعانون من أمراض مزمنة بهدف تحسين جودة حياتهم.",
    points: [
      "متابعة مرضى السكري (النوع 1 و2)",
      "مرضى ارتفاع ضغط الدم",
      "مرضى ارتفاع الكوليسترول",
      "جدول زيارات دورية منتظمة",
      "تقرير شهري بالتطورات الصحية",
    ],
  },
};

let appointments = [];
const BASE_URL = "http://127.0.0.1:5000";

fetch(`${BASE_URL}/appointments`)
  .then((r) => r.json())
  .then((data) => {
    appointments = data;
  });

document.getElementById("appointments-list").style.display = "none";

// ===== MODAL FUNCTIONS =====
function openModal(key) {
  const data = servicesData[key];
  document.getElementById("modal-icon").textContent = data.icon;
  document.getElementById("modal-title").textContent = data.title;
  document.getElementById("modal-desc").textContent = data.desc;
  const list = document.getElementById("modal-list");
  list.innerHTML = "";
  data.points.forEach((point) => {
    const li = document.createElement("li");
    li.textContent = point;
    list.appendChild(li);
  });
  document.getElementById("service-modal").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModalBtn() {
  document.getElementById("service-modal").classList.remove("active");
  document.body.style.overflow = "";
}

function closeModal(event) {
  if (event.target.id === "service-modal") {
    closeModalBtn();
  }
}

// ===== APPOINTMENT FUNCTIONS =====
async function addAppointment() {
  let name = document.getElementById("name").value;
  let phone = document.getElementById("phone").value;
  let department = document.getElementById("department").value;
  let date = document.getElementById("date").value;
  let time = document.getElementById("time").value;

  if (
    name === "" ||
    phone === "" ||
    department === "" ||
    date === "" ||
    time === ""
  ) {
    alert("⚠️ من فضلك املأ جميع الحقول!");
    return;
  }

  let newAppointment = {
    id: Date.now(),
    name: name,
    phone: phone.trim(),
    department: department,
    date: date,
    time: time,
  };

  await fetch(`${BASE_URL}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newAppointment),
  });
  appointments.push(newAppointment);
  alert("✅ تم الحجز بنجاح! اضغط على 'عرض حجوزاتي' لرؤيتها.");
  clearInputs();
}

function clearInputs() {
  document.getElementById("name").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("date").value = "";
  document.getElementById("time").value = "";
}

async function deleteAppointment(id) {
  if (confirm("هل تريد حذف هذا الموعد فعلاً؟")) {
    await fetch(`${BASE_URL}/appointments/` + id, { method: "DELETE" });

    const r = await fetch(`${BASE_URL}/appointments`);
    appointments = await r.json();
    alert("تم الحذف بنجاح");
    document.getElementById("appointments-list").style.display = "none";
  }
}

async function editAppointment(id, name, phone, department, date, time) {
  let newName = prompt("اسم المريض:", name);
  let newPhone = prompt("رقم الهاتف:", phone);
  let newDepartment = prompt("القسم:", department);
  let newDate = prompt("التاريخ (YYYY-MM-DD):", date);
  let newTime = prompt("الوقت:", time);

  if (!newName || !newPhone || !newDate || !newTime) {
    alert("❌ تم إلغاء التعديل");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/appointments/` + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
        phone: newPhone,
        department: newDepartment,
        date: newDate ? new Date(newDate).toISOString().split("T")[0] : null,
        time: newTime,
      }),
    });

    let appt = appointments.find((a) => a.id === id);
    if (appt) {
      appt.name = newName;
      appt.phone = newPhone;
      appt.department = newDepartment;
      appt.date = newDate;
      appt.time = newTime;
    }

    alert("✅ تم التعديل بنجاح!");
    showMyHistory();
    document.getElementById("appointments-list").style.display = "none";
  } catch (err) {
    alert("❌ حصل خطأ: " + err.message);
    console.error(err);
  }
}
function showMyHistory() {
  let searchPhone = prompt("أدخل رقم الموبايل الذي حجزت به:");
  if (!searchPhone) return;

  let userAppointments = appointments.filter(
    (app) => app.phone.trim() === searchPhone.trim(),
  );

  let tableBody = document.getElementById("table-body");
  let tableSection = document.getElementById("appointments-list");
  tableBody.innerHTML = "";

  if (userAppointments.length > 0) {
    tableSection.style.display = "block";
    userAppointments.forEach((app, index) => {
      let newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td>${index + 1}</td>
        <td>${app.name}</td>
        <td>${app.phone}</td>
        <td>${app.department || "-"}</td>
        <td>${app.date}</td>
        <td>${app.time}</td>
        <td><button class="btn-delete" onclick="deleteAppointment(${app.id})">🗑️ حذف</button></td>
        <td><button class="btn-update" onclick="editAppointment(${app.id}, '${app.name}', '${app.phone}','${app.department}', '${app.date ? app.date.split("T")[0] : app.date}' , '${app.time}')">✏️ تعديل</button></td>
        
      `;
      tableBody.appendChild(newRow);
    });
    tableSection.scrollIntoView({ behavior: "smooth" });
    document.getElementById("no-appointments").style.display = "none";
  } else {
    alert("للأسف، مفيش أي حجز مسجل برقم: " + searchPhone);
    tableSection.style.display = "none";
  }
}
