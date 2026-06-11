import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert
} from 'react-native';
import { useQuery } from 'react-query';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { ticketService } from '../services/ticketService';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { useLocation } from '../contexts/LocationContext';

const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const { location, startLocationTracking, stopLocationTracking } = useLocation();

  const { data: tickets, isLoading, refetch } = useQuery(
    'technician-tickets',
    () => ticketService.getTechnicianTickets(),
    {
      refetchInterval: 30000,
    }
  );

  const handleStatusToggle = () => {
    if (location.isTracking) {
      stopLocationTracking();
      Alert.alert('Status', 'You are now offline');
    } else {
      startLocationTracking();
      Alert.alert('Status', 'You are now online and available for assignments');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      assigned: '#ff9800',
      en_route: '#2196f3',
      arrived: '#4caf50',
      in_progress: '#9c27b0',
      completed: '#4caf50'
    };
    return colors[status] || '#757575';
  };

  const activeTickets = tickets?.filter(t => 
    ['assigned', 'en_route', 'arrived', 'in_progress'].includes(t.status)
  ) || [];

  const todayCompleted = tickets?.filter(t => 
    t.status === 'completed' && 
    new Date(t.completed_at).toDateString() === new Date().toDateString()
  ).length || 0;

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning, {user?.name}!</Text>
        <TouchableOpacity 
          style={[
            styles.statusButton, 
            { backgroundColor: location.isTracking ? '#4caf50' : '#f44336' }
          ]}
          onPress={handleStatusToggle}
        >
          <Icon 
            name={location.isTracking ? 'location-on' : 'location-off'} 
            size={20} 
            color="white" 
          />
          <Text style={styles.statusText}>
            {location.isTracking ? 'Online' : 'Offline'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{activeTickets.length}</Text>
          <Text style={styles.statLabel}>Active Tickets</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{todayCompleted}</Text>
          <Text style={styles.statLabel}>Completed Today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>4.8</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>

      {/* Active Tickets */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Assignments</Text>
        {activeTickets.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="assignment" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No active assignments</Text>
            <Text style={styles.emptySubtext}>
              {location.isTracking ? 'Waiting for new tickets...' : 'Go online to receive assignments'}
            </Text>
          </View>
        ) : (
          activeTickets.map((ticket) => (
            <TouchableOpacity
              key={ticket.ticket_id}
              style={styles.ticketCard}
              onPress={() => navigation.navigate('TicketDetails', { ticketId: ticket.ticket_id })}
            >
              <View style={styles.ticketHeader}>
                <Text style={styles.ticketNumber}>{ticket.ticket_number}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ticket.status) }]}>
                  <Text style={styles.statusText}>{ticket.status.replace('_', ' ')}</Text>
                </View>
              </View>
              
              <Text style={styles.ticketDescription}>
                {ticket.issue_category} - {ticket.issue_description.substring(0, 50)}...
              </Text>
              
              <View style={styles.ticketFooter}>
                <View style={styles.customerInfo}>
                  <Icon name="person" size={16} color="#666" />
                  <Text style={styles.customerName}>{ticket.customer_name}</Text>
                </View>
                <View style={styles.timeInfo}>
                  <Icon name="schedule" size={16} color="#666" />
                  <Text style={styles.timeText}>
                    {new Date(ticket.created_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Tickets')}
          >
            <Icon name="list" size={24} color="#1976d2" />
            <Text style={styles.actionText}>All Tickets</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Navigation')}
          >
            <Icon name="navigation" size={24} color="#1976d2" />
            <Text style={styles.actionText}>Navigation</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Icon name="person" size={24} color="#1976d2" />
            <Text style={styles.actionText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1976d2',
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    marginLeft: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  emptyState: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  ticketCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ticketDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerName: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
    minWidth: 80,
  },
  actionText: {
    fontSize: 12,
    color: '#1976d2',
    marginTop: 4,
    fontWeight: '500',
  },
});

export default DashboardScreen;