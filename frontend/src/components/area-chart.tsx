'use client';

import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { TriggerEventDto, useTriggers } from '@/hooks/use-triggers';

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

function formatChartData(triggers: TriggerEventDto[]) {
  if (!triggers) return [];

  // Initialize data structure for each day of the week
  const weeklyData = daysOfWeek.map((day) => ({
    day,
    intensity: 0,
    frequency: 0,
  }));

  // Process triggers
  triggers.forEach((trigger: TriggerEventDto) => {
    const dayIndex = new Date(trigger.createdAt).getDay(); // 0 (Sunday) to 6 (Saturday)
    const dayName = daysOfWeek[(dayIndex + 6) % 7]; // Adjust to start with Monday
    const dayData = weeklyData.find((data) => data.day === dayName);

    if (dayData) {
      dayData.intensity += trigger.intensity;
      dayData.frequency += 1;
    }
  });

  // Calculate average intensity for each day
  weeklyData.forEach((data) => {
    if (data.frequency > 0) {
      data.intensity = data.intensity / data.frequency;
    }
  });

  return weeklyData;
}

export function TriggersAreaChart() {
  const { data: triggers } = useTriggers();

  // Format the chart data
  const chartData = formatChartData(triggers ?? []);

  const chartConfig = {
    intensity: {
      label: 'Intensity',
      color: 'hsl(var(--chart-1))',
    },
    frequency: {
      label: 'Frequency',
      color: 'hsl(var(--chart-2))',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Area Chart</CardTitle>
        <CardDescription>
          Showing trigger intensity and frequency for the past week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="intensity"
              type="natural"
              fill="var(--color-intensity)"
              fillOpacity={0.4}
              stroke="var(--color-intensity)"
            />
            <Area
              dataKey="frequency"
              type="natural"
              fill="var(--color-frequency)"
              fillOpacity={0.4}
              stroke="var(--color-frequency)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Weekly trigger trends <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Monday - Sunday
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
