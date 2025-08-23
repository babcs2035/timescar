'use client';

import dynamic from 'next/dynamic';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Dynamically import the custom HeatmapLayer component, disabling SSR
const HeatmapLayer = dynamic(
  () => import('@/components/HeatmapLayer').then(mod => mod.HeatmapLayer),
  {
    ssr: false,
    loading: () => (
      <Box
        sx={{
          height: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    ),
  },
);

// Define the props structure for the component
interface DashboardPageClientProps {
  averageCars: number;
  prefectureChartData: { name: string; count: number }[];
  histogramData: { name: string; count: number }[];
  classPieData: { name: string; value: number }[];
  top10CarData: { name: string; count: number }[];
  heatmapData: [number, number, number][];
}

export function DashboardPageClient({
  averageCars,
  prefectureChartData,
  histogramData,
  classPieData,
  top10CarData,
  heatmapData,
}: DashboardPageClientProps) {
  // Colors for the Pie Chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* First Row - Prefecture Distribution and National Heatmap */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Typography variant='h5' component='h2' gutterBottom>
                都道府県別ステーション数
              </Typography>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart
                  data={prefectureChartData}
                  margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis
                    dataKey='name'
                    angle={-45}
                    textAnchor='end'
                    height={80}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='count' fill='#8884d8' name='ステーション数' />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Typography variant='h5' component='h2' gutterBottom>
                全国ステーションヒートマップ
              </Typography>
              <Box sx={{ height: 300 }}>
                <MapContainer
                  center={[35.6895, 139.6917]}
                  zoom={5}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <HeatmapLayer points={heatmapData} />
                </MapContainer>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Second Row - Car Count Histogram and Vehicle Class Ratio */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Typography variant='h5' component='h2' gutterBottom>
                車両台数ヒストグラム
              </Typography>
              <Typography variant='h6' color='text.secondary' sx={{ mb: 2 }}>
                平均車両台数: {averageCars.toFixed(2)}台
              </Typography>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart
                  data={histogramData}
                  margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='count' fill='#82ca9d' name='ステーション数' />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Typography variant='h5' component='h2' gutterBottom>
                車両クラス別比率
              </Typography>
              <ResponsiveContainer width='100%' height={300}>
                <PieChart>
                  <Pie
                    data={classPieData}
                    dataKey='value'
                    nameKey='name'
                    cx='50%'
                    cy='50%'
                    outerRadius={100}
                    label
                  >
                    {classPieData.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Third Row - Top 10 Car Models (Full Width) */}
      <Box>
        <Card>
          <CardContent>
            <Typography variant='h5' component='h2' gutterBottom>
              車種トップ10
            </Typography>
            <ResponsiveContainer width='100%' height={400}>
              <BarChart
                layout='vertical'
                data={top10CarData}
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis type='number' />
                <YAxis dataKey='name' type='category' width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey='count' fill='#8884d8' name='台数' />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
