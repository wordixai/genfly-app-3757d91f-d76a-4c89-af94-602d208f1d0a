import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Department } from "../types";

interface QueueDashboardProps {
  departments: Department[];
}

const QueueDashboard = ({ departments }: QueueDashboardProps) => {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="bg-blue-600 text-white">
        <CardTitle className="text-center text-2xl">内科门诊</CardTitle>
        <div className="grid grid-cols-4 text-lg font-semibold mt-2">
          <div className="col-span-1">诊室名称</div>
          <div className="col-span-1">医生</div>
          <div className="col-span-1">正在就诊</div>
          <div className="col-span-1">等待就诊</div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-blue-100">
          {departments.map((dept) => (
            <div key={dept.id} className="grid grid-cols-4 p-4 text-lg">
              <div className="col-span-1 font-medium">{dept.name}</div>
              <div className="col-span-1">{dept.doctor}</div>
              <div className="col-span-1">
                {dept.currentPatient ? (
                  <span className="font-medium">
                    {dept.currentPatient.name}({dept.currentPatient.id}号)
                  </span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </div>
              <div className="col-span-1">
                {dept.waitingPatients.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {dept.waitingPatients.map((patient) => (
                      <span key={patient.id} className="font-medium">
                        {patient.priority === 'normal' ? (
                          <span>{patient.name}({patient.id}号)(普通)</span>
                        ) : (
                          <span>{patient.name}({patient.id}号)</span>
                        )}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QueueDashboard;