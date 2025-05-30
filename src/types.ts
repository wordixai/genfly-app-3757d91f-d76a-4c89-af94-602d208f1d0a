export interface Patient {
  id: number;
  name: string;
  status: 'current' | 'waiting';
  priority?: 'normal' | 'urgent';
}

export interface Department {
  id: number;
  name: string;
  doctor: string;
  currentPatient: Patient | null;
  waitingPatients: Patient[];
}