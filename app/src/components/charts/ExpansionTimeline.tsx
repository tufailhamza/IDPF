import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Play, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const programData = [
  {
    name: 'Ongoza',
    description: 'Teacher Training & School Support Program',
    milestones: [
      { name: 'Initial Launch', status: 'completed', year: 2009 },
      { name: 'Full Operations', status: 'completed', year: 2015 },
      { name: 'Scale Up', status: 'current', year: 2022 },
    ],
    metrics: {
      schools: 1423,
      students: '68.5K',
      countries: 2
    }
  },
  {
    name: 'Rising Schools',
    description: 'Student Loan & Financial Support Program',
    milestones: [
      { name: 'Initial Launch', status: 'completed', year: 2018 },
      { name: 'Full Operations', status: 'current', year: 2021 },
      { name: 'Scale Up', status: 'planned', year: 2025 },
    ],
    metrics: {
      schools: 1124,
      students: '56.3K',
      countries: 3
    }
  },
];

const sparklineData = [
  { year: 2009, repayment: 88 },
  { year: 2010, repayment: 91 },
  { year: 2011, repayment: 93 },
  { year: 2012, repayment: 94 },
  { year: 2013, repayment: 92 },
  { year: 2014, repayment: 95 },
  { year: 2015, repayment: 93 },
  { year: 2016, repayment: 96 },
  { year: 2017, repayment: 94 },
  { year: 2018, repayment: 91 },
  { year: 2019, repayment: 95 },
  { year: 2020, repayment: 93 },
  { year: 2021, repayment: 96 },
  { year: 2022, repayment: 94 },
  { year: 2023, repayment: 95 },
  { year: 2024, repayment: 97 },
];

const ExpansionTimeline = () => {
  const getMilestoneIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'current':
        return <Play className="h-4 w-4 text-primary" />;
      case 'planned':
        return <Circle className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getMilestoneBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'current':
        return 'secondary';
      case 'planned':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Program Timeline & Repayment Performance</CardTitle>
        <p className="text-sm text-muted-foreground">Program milestones with 15-year repayment trend</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          {programData.map((program, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-lg text-foreground">{program.name}</h4>
                  <p className="text-sm text-muted-foreground">{program.description}</p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-right text-sm">
                  <div>
                    <div className="font-medium">{program.metrics.schools}</div>
                    <div className="text-muted-foreground">Schools</div>
                  </div>
                  <div>
                    <div className="font-medium">{program.metrics.students}</div>
                    <div className="text-muted-foreground">Students</div>
                  </div>
                  <div>
                    <div className="font-medium">{program.metrics.countries}</div>
                    <div className="text-muted-foreground">Countries</div>
                  </div>
                </div>
              </div>
              
              {/* Timeline */}
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute top-6 left-4 right-4 h-0.5 bg-border"></div>
                
                {/* Milestones */}
                <div className="flex justify-between items-start">
                  {program.milestones.map((milestone, milestoneIndex) => (
                    <div key={milestoneIndex} className="flex flex-col items-center space-y-2 relative">
                      {/* Icon */}
                      <div className="w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center z-10">
                        {getMilestoneIcon(milestone.status)}
                      </div>
                      
                      {/* Milestone info */}
                      <div className="text-center space-y-1">
                        <Badge variant={getMilestoneBadge(milestone.status)} className="text-xs">
                          {milestone.name}
                        </Badge>
                        <div className="text-xs text-muted-foreground">{milestone.year}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-foreground">15-Year Repayment Trend</h4>
            <Badge variant="secondary" className="bg-success/10 text-success">
              Consistently &gt; 90%
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={80}>
            <LineChart data={sparklineData}>
              <XAxis 
                dataKey="year" 
                hide
              />
              <YAxis 
                domain={[85, 100]}
                hide
              />
              <Tooltip 
                formatter={(value: number) => [`${value}%`, 'Repayment Rate']}
                labelFormatter={(label) => `Year: ${label}`}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="repayment" 
                stroke="hsl(var(--success))" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpansionTimeline;