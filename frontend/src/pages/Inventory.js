import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Chip, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField, MenuItem, Dialog,
  DialogTitle, DialogContent, DialogActions, Alert, LinearProgress, Tabs, Tab
} from '@mui/material';
import {
  Inventory as InventoryIcon, Warning as WarningIcon, Add as AddIcon,
  Remove as RemoveIcon, LocalShipping as ShippingIcon, Assignment as AssignIcon,
  TrendingDown as TrendingDownIcon, TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

const Inventory = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedPart, setSelectedPart] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [filter, setFilter] = useState('all');

  const inventory = [
    {
      id: 1, partName: 'Battery Pack (48V)', partCode: 'BAT-48V-001', category: 'Battery',
      currentStock: 0, minStock: 5, maxStock: 50, unitCost: 25000, supplier: 'BatteryTech Ltd',
      deliveryETA: '3-5 days', status: 'out_of_stock', allocatedToTickets: 0,
      onOrder: 10, orderDate: '2024-01-10', defectiveReturns: 2, warranty: 'Yes',
      fastMoving: true, lastRestocked: '2024-01-05', stockAging: 15
    },
    {
      id: 2, partName: 'Motor Belt', partCode: 'MOT-BLT-002', category: 'Motor',
      currentStock: 3, minStock: 10, maxStock: 30, unitCost: 1500, supplier: 'MotorParts Co',
      deliveryETA: '2-3 days', status: 'low_stock', allocatedToTickets: 2,
      onOrder: 15, orderDate: '2024-01-12', defectiveReturns: 0, warranty: 'Yes',
      fastMoving: true, lastRestocked: '2024-01-08', stockAging: 12
    },
    {
      id: 3, partName: 'Brake Pads (Front)', partCode: 'BRK-PAD-003', category: 'Brake',
      currentStock: 25, minStock: 8, maxStock: 40, unitCost: 800, supplier: 'BrakeTech India',
      deliveryETA: '1-2 days', status: 'available', allocatedToTickets: 3,
      onOrder: 0, orderDate: null, defectiveReturns: 1, warranty: 'Yes',
      fastMoving: false, lastRestocked: '2024-01-01', stockAging: 20
    },
    {
      id: 4, partName: 'Display Unit (LCD)', partCode: 'DSP-LCD-004', category: 'Electronics',
      currentStock: 12, minStock: 5, maxStock: 25, unitCost: 3500, supplier: 'ElectroDisplay',
      deliveryETA: '4-6 days', status: 'available', allocatedToTickets: 1,
      onOrder: 0, orderDate: null, defectiveReturns: 0, warranty: 'Yes',
      fastMoving: false, lastRestocked: '2023-12-28', stockAging: 25
    },
    {
      id: 5, partName: 'Charging Port', partCode: 'CHG-PRT-005', category: 'Charging',
      currentStock: 8, minStock: 6, maxStock: 20, unitCost: 1200, supplier: 'ChargeTech',
      deliveryETA: '2-4 days', status: 'available', allocatedToTickets: 0,
      onOrder: 5, orderDate: '2024-01-14', defectiveReturns: 1, warranty: 'No',
      fastMoving: true, lastRestocked: '2024-01-10', stockAging: 10
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      out_of_stock: 'error', low_stock: 'warning', available: 'success'
    };
    return colors[status] || 'default';
  };

  const getStockLevel = (current, min, max) => {
    if (current === 0) return 'out_of_stock';
    if (current <= min) return 'low_stock';
    return 'available';
  };

  const filteredInventory = inventory.filter(item => {
    if (filter === 'all') return true;
    return getStockLevel(item.currentStock, item.minStock, item.maxStock) === filter;
  });

  const outOfStockCount = inventory.filter(item => item.currentStock === 0).length;
  const lowStockCount = inventory.filter(item => item.currentStock > 0 && item.currentStock <= item.minStock).length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0);
  const fastMovingCount = inventory.filter(item => item.fastMoving).length;

  const handleViewPart = (part) => {
    setSelectedPart(part);
    setOpenDialog(true);
  };

  return (
    <Box>
      <Typography variant="h4" mb={3}>📦 Parts Inventory Management</Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#ffebee' }}>
            <CardContent>
              <Typography color="textSecondary">Out of Stock</Typography>
              <Typography variant="h4" color="error">{outOfStockCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#fff3e0' }}>
            <CardContent>
              <Typography color="textSecondary">Low Stock</Typography>
              <Typography variant="h4" color="warning.main">{lowStockCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e8f5e8' }}>
            <CardContent>
              <Typography color="textSecondary">Total Items</Typography>
              <Typography variant="h4">{inventory.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e3f2fd' }}>
            <CardContent>
              <Typography color="textSecondary">Inventory Value</Typography>
              <Typography variant="h4">₹{(totalValue / 100000).toFixed(1)}L</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Critical Alerts */}
      {outOfStockCount > 0 && (
        <Alert severity="error" sx={{ mb: 2 }} icon={<WarningIcon />}>
          <Typography variant="h6">🚨 Critical Stock Alert</Typography>
          <Typography>{outOfStockCount} item(s) are out of stock. Service operations may be affected.</Typography>
        </Alert>
      )}

      {lowStockCount > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }} icon={<WarningIcon />}>
          <Typography variant="h6">⚠️ Low Stock Warning</Typography>
          <Typography>{lowStockCount} item(s) are running low. Consider reordering soon.</Typography>
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">📋 Inventory Overview</Typography>
            <Box display="flex" gap={2}>
              <TextField
                select size="small" label="Filter" value={filter}
                onChange={(e) => setFilter(e.target.value)} sx={{ minWidth: 150 }}
              >
                <MenuItem value="all">All Items</MenuItem>
                <MenuItem value="out_of_stock">Out of Stock</MenuItem>
                <MenuItem value="low_stock">Low Stock</MenuItem>
                <MenuItem value="available">Available</MenuItem>
              </TextField>
              <Button variant="contained" startIcon={<AddIcon />}>
                Add New Part
              </Button>
            </Box>
          </Box>

          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
            <Tab label="Stock Overview" />
            <Tab label="Analytics" />
            <Tab label="Orders" />
          </Tabs>

          {tabValue === 0 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Part Details</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Stock Level</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Allocated</TableCell>
                    <TableCell>Unit Cost</TableCell>
                    <TableCell>Supplier</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">{item.partName}</Typography>
                          <Typography variant="caption" color="textSecondary">{item.partCode}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={item.category} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">{item.currentStock}/{item.maxStock}</Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={(item.currentStock / item.maxStock) * 100}
                            color={getStatusColor(getStockLevel(item.currentStock, item.minStock, item.maxStock))}
                            sx={{ width: 80, mt: 0.5 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getStockLevel(item.currentStock, item.minStock, item.maxStock).replace('_', ' ')} 
                          color={getStatusColor(getStockLevel(item.currentStock, item.minStock, item.maxStock))} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{item.allocatedToTickets}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">₹{item.unitCost.toLocaleString()}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">{item.supplier}</Typography>
                          <Typography variant="caption" color="textSecondary">ETA: {item.deliveryETA}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Button size="small" onClick={() => handleViewPart(item)}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tabValue === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" mb={2}>📊 Fast-Moving Parts</Typography>
                {inventory.filter(item => item.fastMoving).map((item) => (
                  <Box key={item.id} display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography>{item.partName}</Typography>
                    <Chip label="Fast Moving" color="success" size="small" icon={<TrendingUpIcon />} />
                  </Box>
                ))}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" mb={2}>⏰ Stock Aging Analysis</Typography>
                {inventory.map((item) => (
                  <Box key={item.id} mb={2}>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="body2">{item.partName}</Typography>
                      <Typography variant="body2">{item.stockAging} days</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min((item.stockAging / 30) * 100, 100)}
                      color={item.stockAging > 20 ? 'warning' : 'success'}
                    />
                  </Box>
                ))}
              </Grid>
            </Grid>
          )}

          {tabValue === 2 && (
            <Box>
              <Typography variant="h6" mb={2}>🚚 Parts on Order</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Part Name</TableCell>
                      <TableCell>Quantity Ordered</TableCell>
                      <TableCell>Order Date</TableCell>
                      <TableCell>Expected Delivery</TableCell>
                      <TableCell>Supplier</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inventory.filter(item => item.onOrder > 0).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.partName}</TableCell>
                        <TableCell>{item.onOrder}</TableCell>
                        <TableCell>{item.orderDate}</TableCell>
                        <TableCell>{item.deliveryETA}</TableCell>
                        <TableCell>{item.supplier}</TableCell>
                        <TableCell>
                          <Chip label="In Transit" color="info" size="small" icon={<ShippingIcon />} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Part Detail Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6">📦 {selectedPart?.partName}</Typography>
        </DialogTitle>
        <DialogContent>
          {selectedPart && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" mb={2}>📋 Part Information</Typography>
                <Typography>🏷️ Part Code: {selectedPart.partCode}</Typography>
                <Typography>📂 Category: {selectedPart.category}</Typography>
                <Typography>💰 Unit Cost: ₹{selectedPart.unitCost.toLocaleString()}</Typography>
                <Typography>🏭 Supplier: {selectedPart.supplier}</Typography>
                <Typography>🚚 Delivery ETA: {selectedPart.deliveryETA}</Typography>
                <Typography>🛡️ Warranty: {selectedPart.warranty}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" mb={2}>📊 Stock Details</Typography>
                <Typography>📦 Current Stock: {selectedPart.currentStock}</Typography>
                <Typography>⚠️ Minimum Stock: {selectedPart.minStock}</Typography>
                <Typography>📈 Maximum Stock: {selectedPart.maxStock}</Typography>
                <Typography>🎯 Allocated to Tickets: {selectedPart.allocatedToTickets}</Typography>
                <Typography>🚚 On Order: {selectedPart.onOrder}</Typography>
                <Typography>❌ Defective Returns: {selectedPart.defectiveReturns}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" mb={2}>📈 Analytics</Typography>
                <Typography>📅 Last Restocked: {selectedPart.lastRestocked}</Typography>
                <Typography>⏰ Stock Aging: {selectedPart.stockAging} days</Typography>
                <Typography>🔥 Fast Moving: {selectedPart.fastMoving ? 'Yes' : 'No'}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
          <Button variant="outlined" startIcon={<AssignIcon />}>Allocate to Ticket</Button>
          <Button variant="contained" startIcon={<AddIcon />}>Reorder Stock</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Inventory;