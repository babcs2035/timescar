'use client';

import {
  Stack,
  Typography,
  Paper,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
} from '@mui/material';
import { useMemo, useState } from 'react';
import type { Station } from '@/types';

interface FilterPanelProps {
  stations: Station[];
  selectedPrefecture: string;
  setSelectedPrefecture: (value: string) => void;
  selectedCity: string;
  setSelectedCity: (value: string) => void;
  selectedCarNames: string[];
  setSelectedCarNames: (value: string[]) => void;
  filteredCount: number;
}

export function FilterPanel({
  stations,
  selectedPrefecture,
  setSelectedPrefecture,
  selectedCity,
  setSelectedCity,
  selectedCarNames,
  setSelectedCarNames,
  filteredCount,
}: FilterPanelProps) {
  const [openCityDialog, setOpenCityDialog] = useState(false);
  const [openCarDialog, setOpenCarDialog] = useState(false);

  // Temporary states for dialogs
  const [tempSelectedPrefecture, setTempSelectedPrefecture] =
    useState(selectedPrefecture);
  const [tempSelectedCity, setTempSelectedCity] = useState(selectedCity);
  const [tempSelectedCarNames, setTempSelectedCarNames] =
    useState(selectedCarNames);

  // Memoize unique filter options and grouped car names
  const { prefectures, cities, groupedCarNames } = useMemo(() => {
    const prefectureSet = new Set<string>();
    const citySet = new Set<string>();
    const carData = new Map<string, string[]>();

    stations.forEach(s => {
      // Extract prefecture from address
      const prefectureMatch = s.address.match(/^(.{2,3}?[都道府県])/);
      if (prefectureMatch) {
        prefectureSet.add(prefectureMatch[0]);
      }

      // Extract city from address
      if (s.address.startsWith(tempSelectedPrefecture)) {
        const cityMatch = s.address.match(/市|区|郡|町|村/);
        if (cityMatch && cityMatch.index !== undefined) {
          const cityIndex = cityMatch.index + cityMatch[0].length;
          const city = s.address.substring(
            prefectureMatch ? prefectureMatch[0].length : 0,
            cityIndex,
          );
          citySet.add(city);
        }
      }

      // Group car names by class
      s.car_fleet.forEach(c => {
        if (!carData.has(c.class_name)) {
          carData.set(c.class_name, []);
        }
        if (!carData.get(c.class_name)?.includes(c.car_name)) {
          carData.get(c.class_name)?.push(c.car_name);
        }
      });
    });

    // Sort and structure grouped car names
    const sortedCarNames: { [key: string]: string[] } = {};
    const order = ['ベーシック', 'ミドル', 'プレミアム'];
    order.forEach(cl => {
      if (carData.has(cl)) {
        sortedCarNames[cl] = carData.get(cl)?.sort() || [];
      }
    });

    return {
      prefectures: ['all', ...Array.from(prefectureSet)].sort(),
      cities: ['all', ...Array.from(citySet)].sort(),
      groupedCarNames: sortedCarNames,
    };
  }, [stations, tempSelectedPrefecture]);

  // Handle dialog open/close
  const handleCityDialogOpen = () => {
    setTempSelectedPrefecture(selectedPrefecture);
    setTempSelectedCity(selectedCity);
    setOpenCityDialog(true);
  };
  const handleCityDialogClose = () => setOpenCityDialog(false);
  const handleCityDialogOk = () => {
    setSelectedPrefecture(tempSelectedPrefecture);
    setSelectedCity(tempSelectedCity);
    setOpenCityDialog(false);
  };

  const handleCarDialogOpen = () => {
    setTempSelectedCarNames(selectedCarNames);
    setOpenCarDialog(true);
  };
  const handleCarDialogClose = () => setOpenCarDialog(false);
  const handleCarDialogOk = () => {
    setSelectedCarNames(tempSelectedCarNames);
    setOpenCarDialog(false);
  };

  // Handle "select all" for a group
  const handleSelectAllGroup = (group: string, isChecked: boolean) => {
    const groupNames = groupedCarNames[group] || [];
    if (isChecked) {
      setTempSelectedCarNames(prev => [...new Set([...prev, ...groupNames])]);
    } else {
      setTempSelectedCarNames(prev =>
        prev.filter(name => !groupNames.includes(name)),
      );
    }
  };

  // Check if a group is fully selected
  const isGroupFullySelected = (group: string) => {
    const groupNames = groupedCarNames[group] || [];
    return (
      groupNames.length > 0 &&
      groupNames.every(name => tempSelectedCarNames.includes(name))
    );
  };

  // Check if a single car is selected
  const isCarSelected = (carName: string) =>
    tempSelectedCarNames.includes(carName);

  // Handlers for deleting chips
  const handlePrefectureDelete = () => {
    setSelectedPrefecture('all');
    setSelectedCity('all');
  };
  const handleCityDelete = () => setSelectedCity('all');
  const handleCarNameDelete = (carNameToDelete: string) => {
    setSelectedCarNames(
      selectedCarNames.filter(name => name !== carNameToDelete),
    );
  };
  const handleClearAll = () => {
    setSelectedPrefecture('all');
    setSelectedCity('all');
    setSelectedCarNames([]);
  };

  const areFiltersActive =
    selectedPrefecture !== 'all' || selectedCarNames.length > 0;

  return (
    <Paper
      sx={{
        p: 2,
        zIndex: 1000,
        position: 'relative',
        borderRadius: 0,
        boxShadow: 3,
      }}
    >
      <Typography variant='h4' gutterBottom>
        Times Car Station Map
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ mb: 2, flexWrap: 'wrap' }}
      >
        {/* City/Prefecture Filter Button */}
        <Box sx={{ minWidth: { xs: '100%', sm: 150 } }}>
          <Button variant='outlined' onClick={handleCityDialogOpen} fullWidth>
            エリアを選択
          </Button>
          <Dialog open={openCityDialog} onClose={handleCityDialogClose}>
            <DialogTitle>エリアを選択</DialogTitle>
            <DialogContent>
              <Stack
                direction='column'
                spacing={2}
                sx={{ py: 2, minWidth: 300 }}
              >
                <FormControl fullWidth>
                  <InputLabel>都道府県</InputLabel>
                  <Select
                    value={tempSelectedPrefecture}
                    label='都道府県'
                    onChange={e => setTempSelectedPrefecture(e.target.value)}
                  >
                    {prefectures.map(pref => (
                      <MenuItem key={pref} value={pref}>
                        {pref === 'all' ? 'すべての都道府県' : pref}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl
                  fullWidth
                  disabled={tempSelectedPrefecture === 'all'}
                >
                  <InputLabel>市区町村</InputLabel>
                  <Select
                    value={tempSelectedCity}
                    label='市区町村'
                    onChange={e => setTempSelectedCity(e.target.value)}
                  >
                    {cities.map(city => (
                      <MenuItem key={city} value={city}>
                        {city === 'all' ? 'すべての市区町村' : city}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCityDialogClose}>キャンセル</Button>
              <Button onClick={handleCityDialogOk} variant='contained'>
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </Box>

        {/* Car Selection Filter Button */}
        <Box sx={{ minWidth: { xs: '100%', sm: 150 } }}>
          <Button variant='outlined' onClick={handleCarDialogOpen} fullWidth>
            車種を選択
          </Button>
          <Dialog
            open={openCarDialog}
            onClose={handleCarDialogClose}
            fullWidth
            maxWidth='sm'
          >
            <DialogTitle>車種を選択</DialogTitle>
            <DialogContent>
              <FormGroup>
                {Object.entries(groupedCarNames).map(([group, names]) => (
                  <Box
                    key={group}
                    sx={{
                      mb: 2,
                      border: '1px solid #eee',
                      p: 2,
                      borderRadius: 2,
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isGroupFullySelected(group)}
                          onChange={e =>
                            handleSelectAllGroup(group, e.target.checked)
                          }
                        />
                      }
                      label={
                        <Typography
                          variant='subtitle1'
                          sx={{ fontWeight: 'bold' }}
                        >
                          {group} (すべて選択)
                        </Typography>
                      }
                    />
                    <Grid container spacing={1} sx={{ pl: 2 }}>
                      {names.map(name => (
                        <Grid xs={6} sm={4} md={3} key={name}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={isCarSelected(name)}
                                onChange={e => {
                                  if (e.target.checked) {
                                    setTempSelectedCarNames(prev => [
                                      ...prev,
                                      name,
                                    ]);
                                  } else {
                                    setTempSelectedCarNames(prev =>
                                      prev.filter(n => n !== name),
                                    );
                                  }
                                }}
                              />
                            }
                            label={name}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                ))}
              </FormGroup>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCarDialogClose}>キャンセル</Button>
              <Button onClick={handleCarDialogOk} variant='contained'>
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Stack>

      {areFiltersActive && (
        <Box sx={{ my: 2 }}>
          <Stack
            direction='row'
            spacing={1}
            alignItems='center'
            flexWrap='wrap'
          >
            <Typography variant='body2' sx={{ mr: 1, fontWeight: 'bold' }}>
              選択中の条件:
            </Typography>
            {selectedPrefecture !== 'all' && (
              <Chip
                label={selectedPrefecture}
                onDelete={handlePrefectureDelete}
              />
            )}
            {selectedCity !== 'all' && (
              <Chip label={selectedCity} onDelete={handleCityDelete} />
            )}
            {selectedCarNames.map(name => (
              <Chip
                key={name}
                label={name}
                onDelete={() => handleCarNameDelete(name)}
              />
            ))}
            <Button
              onClick={handleClearAll}
              size='small'
              variant='text'
              color='error'
            >
              すべてクリア
            </Button>
          </Stack>
        </Box>
      )}
      <Typography variant='body1'>{`Showing ${filteredCount} of ${stations.length} stations.`}</Typography>
    </Paper>
  );
}
