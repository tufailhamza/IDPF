import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { name: "School Leadership", value: 324, sessions: 18, participants: 324 },
  { name: "Teacher Training", value: 512, sessions: 28, participants: 512 },
  { name: "Financial Literacy", value: 189, sessions: 12, participants: 189 },
  { name: "Digital Skills", value: 267, sessions: 15, participants: 267 },
  { name: "Admin & Operations", value: 156, sessions: 8, participants: 156 },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))', 'hsl(var(--destructive))'];

const TrainingProgramsChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Training Programs Delivered</CardTitle>
        <p className="text-sm text-muted-foreground">Participants by program type (2024)</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name, props) => [
                `${value} participants (${props.payload.sessions} sessions)`,
                props.payload.name
              ]}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Legend 
              verticalAlign="top"
              align="center"
              wrapperStyle={{ paddingTop: '10px', paddingBottom: '10px', fontSize: '12px' }}
              height={50}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="space-y-2 mt-4">
          {data.map((item, index) => (
            <div key={item.name} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="font-medium">{item.name}</span>
              </div>
              <div className="text-right">
                <div className="font-medium">{item.participants} participants</div>
                <div className="text-xs text-muted-foreground">{item.sessions} sessions</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingProgramsChart;