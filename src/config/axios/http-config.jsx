const baseURL = `http://localhost:3000/api/`;

export const login = `${baseURL}/login`;

// Receptionistes

export const getReception = `${baseURL}admin/get_allReception`;

export const deleteReception = `${baseURL}admin/deleteReception_info/`;

export const updateReception = `${baseURL}admin/editReception_info/`;

export const addReception = `${baseURL}admin/addReception`;

// Doctors

export const getDoctors = `${baseURL}admin/getAlldoctors`;

export const getDoctorAppointments = `${baseURL}admin/doctor_appointment/`;

export const deleteDoctor = `${baseURL}admin/deleteDoctor/`;

export const updateDoctor = `${baseURL}admin/editDoctor_info/`;

export const addDoctor = `${baseURL}admin/addDoctor`;

// Departments

export const getDepartments = `${baseURL}admin/getallDepartments`;

export const deleteDepartment = `${baseURL}admin/deletedepartment/`;

export const addDepartment = `${baseURL}admin/addDepartments`;

export const updateDepartment = `${baseURL}admin/editdepartment/`;

// Appointments

export const getAppointments = `${baseURL}receptions/getAllAppointment`;

export const updateAppointment = `${baseURL}receptions/editappointment/`;

export const deleteAppintment = `${baseURL}receptions/deleteAppointment/`;

// Reception User

export const getReceptionInfo = `${baseURL}receptions/getReception_info/`;

export const updateReceptionInfo = `${baseURL}receptions/editReception_info/`;

// Patients
export const getPatients = `${baseURL}receptions/getallPatients`;

export const updatePatients = `${baseURL}receptions/editpatient/`;

export const deletePatients = `${baseURL}receptions/deletePatient/`;

export const addPatient = `${baseURL}receptions/addPatient`;

export const addAppointment = `${baseURL}receptions/addappointment/`;

// Doctor
export const getDoctorInfo = `${baseURL}doctors/getMyInfo/`;

export const getDoctorAppointment = `${baseURL}doctors/doctor_appointment/`;

export const updateDoctorDetails = `${baseURL}doctors/editDoctorInfo/`;

export const updateDetails = `${baseURL}doctors/editPatientDetails/`;

export const getDetails = `${baseURL}doctors/view_patient_details/`;
