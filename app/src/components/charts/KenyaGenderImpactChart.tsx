import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Female", value: 64.0, loans: 1789, disbursed: 247.68, avgLoan: 138448 },
  { name: "Male", value: 36.0, loans: 1006, disbursed: 149.95, avgLoan: 149055 },
];

const COLORS = {
  Female: "hsl(var(--warning))",
  Male: "hsl(var(--primary))",
};

const KenyaGenderImpactChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Gender Impact Analysis</CardTitle>
        <p className="text-sm text-muted-foreground">Strong female entrepreneurship representation</p>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-foreground">2,795</div>
          <div className="text-sm text-muted-foreground">Total Proprietors</div>
        </div>
        
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={96}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name, props) => {
                const entry = props.payload;
                return [`${value}% (${entry.loans} loans, KES ${entry.disbursed}M)`, "Distribution"];
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="space-y-3 mt-4">
          {data.map((item) => (
            <div key={item.name} className="border rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[item.name as keyof typeof COLORS] }}
                  />
                  <span className="font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-lg">{item.value}%</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                <div>
                  <div className="font-medium text-foreground">{item.loans}</div>
                  <div>Loans</div>
                </div>
                <div>
                  <div className="font-medium text-foreground">KES {item.disbursed}M</div>
                  <div>Disbursed</div>
                </div>
                <div>
                  <div className="font-medium text-foreground">KES {item.avgLoan.toLocaleString()}</div>
                  <div>Avg Loan</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default KenyaGenderImpactChart;
