import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AttendanceScreen({ navigation }) {
  const [subjects, setSubjects] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [subjectName, setSubjectName] = useState('');
  const [totalClasses, setTotalClasses] = useState('');
  const [attendedClasses, setAttendedClasses] = useState('');

  // Load data from AsyncStorage when component mounts
  useEffect(() => {
    loadSubjects();
  }, []);

  // Save data to AsyncStorage whenever subjects change
  useEffect(() => {
    saveSubjects();
  }, [subjects]);

  const loadSubjects = async () => {
    try {
      const savedSubjects = await AsyncStorage.getItem('attendanceSubjects');
      if (savedSubjects !== null) {
        setSubjects(JSON.parse(savedSubjects));
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  };

  const saveSubjects = async () => {
    try {
      await AsyncStorage.setItem('attendanceSubjects', JSON.stringify(subjects));
    } catch (error) {
      console.error('Error saving subjects:', error);
    }
  };

  const addSubject = () => {
    const total = parseInt(totalClasses);
    const attended = parseInt(attendedClasses);
    
    if (subjectName.trim() && !isNaN(total) && !isNaN(attended) && total > 0 && attended >= 0 && attended <= total) {
      const newSubject = {
        id: Date.now(),
        name: subjectName.trim(),
        totalClasses: total,
        attendedClasses: attended,
        attendance: ((attended / total) * 100).toFixed(2)
      };
      
      setSubjects([...subjects, newSubject]);
      setSubjectName('');
      setTotalClasses('');
      setAttendedClasses('');
      setModalVisible(false);
    }
  };

  const deleteSubject = (id) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
  };

  const updateAttendance = (id, newAttended) => {
    setSubjects(subjects.map(subject => {
      if (subject.id === id) {
        const attended = parseInt(newAttended) || 0;
        const total = subject.totalClasses;
        if (attended >= 0 && attended <= total) {
          return {
            ...subject,
            attendedClasses: attended,
            attendance: ((attended / total) * 100).toFixed(2)
          };
        }
      }
      return subject;
    }));
  };

  const updateTotalClasses = (id, newTotal) => {
    setSubjects(subjects.map(subject => {
      if (subject.id === id) {
        const total = parseInt(newTotal) || 1;
        const attended = Math.min(subject.attendedClasses, total); // Ensure attended doesn't exceed total
        if (total > 0) {
          return {
            ...subject,
            totalClasses: total,
            attendedClasses: attended,
            attendance: ((attended / total) * 100).toFixed(2)
          };
        }
      }
      return subject;
    }));
  };

  const incrementAttendance = (id) => {
    setSubjects(subjects.map(subject => {
      if (subject.id === id) {
        const newAttended = Math.min(subject.attendedClasses + 1, subject.totalClasses);
        return {
          ...subject,
          attendedClasses: newAttended,
          attendance: ((newAttended / subject.totalClasses) * 100).toFixed(2)
        };
      }
      return subject;
    }));
  };

  const decrementAttendance = (id) => {
    setSubjects(subjects.map(subject => {
      if (subject.id === id) {
        const newAttended = Math.max(subject.attendedClasses - 1, 0);
        return {
          ...subject,
          attendedClasses: newAttended,
          attendance: ((newAttended / subject.totalClasses) * 100).toFixed(2)
        };
      }
      return subject;
    }));
  };

  const incrementTotalClasses = (id) => {
    setSubjects(subjects.map(subject => {
      if (subject.id === id) {
        const newTotal = subject.totalClasses + 1;
        return {
          ...subject,
          totalClasses: newTotal,
          attendance: ((subject.attendedClasses / newTotal) * 100).toFixed(2)
        };
      }
      return subject;
    }));
  };

  const decrementTotalClasses = (id) => {
    setSubjects(subjects.map(subject => {
      if (subject.id === id) {
        const newTotal = Math.max(subject.totalClasses - 1, 1); // Minimum 1 total class
        const newAttended = Math.min(subject.attendedClasses, newTotal); // Adjust attended if necessary
        return {
          ...subject,
          totalClasses: newTotal,
          attendedClasses: newAttended,
          attendance: ((newAttended / newTotal) * 100).toFixed(2)
        };
      }
      return subject;
    }));
  };

  const clearAllData = async () => {
    try {
      await AsyncStorage.removeItem('attendanceSubjects');
      setSubjects([]);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance Tracker</Text>      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Add Subject</Text>
      </TouchableOpacity>

      <ScrollView style={styles.subjectsContainer} showsVerticalScrollIndicator={false}>
        {subjects.map((subject) => (
          <View key={subject.id} style={styles.subjectCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.subjectName}>{subject.name}</Text>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => deleteSubject(subject.id)}
              >
                <Text style={styles.deleteText}>×</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.statsRow}>
              <Text style={[styles.attendanceText, { color: parseFloat(subject.attendance) >= 75 ? '#44ff44' : '#ff4444' }]}>
                {subject.attendance}%
              </Text>
            </View>
            
            {/* Total Classes Row */}
            <View style={styles.attendanceRow}>
              <Text style={styles.attendedLabel}>Total Classes:</Text>
              <View style={styles.attendanceControls}>
                <TouchableOpacity 
                  style={styles.incrementButton}
                  onPress={() => decrementTotalClasses(subject.id)}
                >
                  <Text style={styles.incrementText}>-</Text>
                </TouchableOpacity>
                
                <TextInput
                  style={styles.attendanceInput}
                  value={subject.totalClasses.toString()}
                  onChangeText={(text) => updateTotalClasses(subject.id, text)}
                  keyboardType="numeric"
                  maxLength={3}
                />
                
                <TouchableOpacity 
                  style={styles.incrementButton}
                  onPress={() => incrementTotalClasses(subject.id)}
                >
                  <Text style={styles.incrementText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Classes Attended Row */}
            <View style={styles.attendanceRow}>
              <Text style={styles.attendedLabel}>Classes Attended:</Text>
              <View style={styles.attendanceControls}>
                <TouchableOpacity 
                  style={styles.incrementButton}
                  onPress={() => decrementAttendance(subject.id)}
                >
                  <Text style={styles.incrementText}>-</Text>
                </TouchableOpacity>
                
                <TextInput
                  style={styles.attendanceInput}
                  value={subject.attendedClasses.toString()}
                  onChangeText={(text) => updateAttendance(subject.id, text)}
                  keyboardType="numeric"
                  maxLength={3}
                />
                
                <TouchableOpacity 
                  style={styles.incrementButton}
                  onPress={() => incrementAttendance(subject.id)}
                >
                  <Text style={styles.incrementText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomButtons}>
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={clearAllData}
        >
          <Text style={styles.buttonTextSmall}>Clear All</Text>
        </TouchableOpacity>

      </View>

      {/* Add Subject Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Subject</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Subject Name"
              placeholderTextColor="#888"
              value={subjectName}
              onChangeText={setSubjectName}
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Total Classes, > 0"
              placeholderTextColor="#888"
              value={totalClasses}
              onChangeText={setTotalClasses}
              keyboardType="numeric"
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Classes Attended"
              placeholderTextColor="#888"
              value={attendedClasses}
              onChangeText={setAttendedClasses}
              keyboardType="numeric"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={addSubject}
              >
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 40,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  subjectsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  subjectCard: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  subjectName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  statText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  attendanceText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  attendanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  attendedLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  attendanceControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  incrementButton: {
    backgroundColor: '#4a90e2',
    width: 35,
    height: 35,
    borderRadius: 17.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  incrementText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  attendanceInput: {
    backgroundColor: '#333',
    color: 'white',
    padding: 10,
    borderRadius: 6,
    fontSize: 16,
    width: 60,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#555',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  clearButton: {
    backgroundColor: '#666',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonTextSmall: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    padding: 30,
    borderRadius: 15,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 25,
  },
  modalInput: {
    backgroundColor: '#333',
    color: 'white',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#555',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#666',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#4a90e2',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
});