import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Hospital, Clock } from 'lucide-react';
import QueueDashboard from './components/QueueDashboard';
import { Department, Patient } from './types';

const App = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: 1,
      name: '16诊室风湿免疫科门诊',
      doctor: '刘永杰',
      currentPatient: { id: 25, name: '马成', status: 'current' },
      waitingPatients: [{ id: 45, name: '芳', status: 'waiting' }]
    },
    {
      id: 2,
      name: '18诊室呼吸内科门诊',
      doctor: '倪允启',
      currentPatient: { id: 26, name: '霞', status: 'current' },
      waitingPatients: []
    },
    {
      id: 3,
      name: '19诊室心血管门诊',
      doctor: '王浩',
      currentPatient: { id: 5, name: '徐航', status: 'current' },
      waitingPatients: [{ id: 35, name: '柴森', status: 'waiting' }]
    },
    {
      id: 4,
      name: '21诊室心脏大血管科',
      doctor: '柴召强',
      currentPatient: { id: 32, name: '郭霞', status: 'current' },
      waitingPatients: [{ id: 0, name: '朱合', status: 'waiting', priority: 'normal' }]
    },
    {
      id: 5,
      name: '26诊室内分泌糖尿病门诊',
      doctor: '司庆盈',
      currentPatient: { id: 30, name: '曹娇', status: 'current' },
      waitingPatients: []
    },
    {
      id: 6,
      name: '27诊室神经内科门诊',
      doctor: '刘翠玲',
      currentPatient: null,
      waitingPatients: [{ id: 19, name: '张武', status: 'waiting' }, { id: 20, name: '徐云', status: 'waiting' }]
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-blue-50">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Hospital className="h-8 w-8 mr-2" />
            <h1 className="text-2xl font-bold">医院门诊排队系统</h1>
          </div>
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            <span className="text-lg">{format(currentTime, 'HH:mm:ss')}</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <QueueDashboard departments={departments} />
      </main>

      <footer className="bg-blue-600 text-white p-2 text-center">
        <p>请快速, 取回检查报告后请再次刷卡!</p>
      </footer>
    </div>
  );
};

export default App;