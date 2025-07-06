import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  GraduationCap, 
  User, 
  Users,
  Award,
  TrendingUp,
  CheckCircle
} from 'lucide-react'
import { mockBootcamps, mockAttendees, mockAttendeeRecords } from '../data/mockData'
import { GraduationStatus, GraduationStatusColors } from '../types'

const GraduationProcessing: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const bootcamp = mockBootcamps.find(b => b.id === id)
  const [processingMode, setProcessingMode] = useState<'individual' | 'batch'>('individual')
  const [selectedAttendee, setSelectedAttendee] = useState(mockAttendees[0])
  const [isProcessing, setIsProcessing] = useState(false)

  if (!bootcamp) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Bootcamp not found</h2>
        <Link to="/" className="btn-primary mt-4">Back to Dashboard</Link>
      </div>
    )
  }

  const totalSessions = bootcamp.totalWeeks * bootcamp.sessionsPerWeek
  const maxTotalScore = bootcamp.assignmentMaxScore * bootcamp.totalWeeks

  const processIndividualGraduation = async (attendee: string) => {
    setIsProcessing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Processing graduation for:', { bootcamp: id, attendee })
    setIsProcessing(false)
  }

  const processAllGraduations = async () => {
    setIsProcessing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('Processing all graduations for bootcamp:', id)
    setIsProcessing(false)
  }

  const getGraduationCriteria = (record: any) => {
    const attendanceRate = Math.round((record.attendanceCount / totalSessions) * 100)
    const scorePercentage = Math.round((record.totalAssignmentScore / maxTotalScore) * 100)
    
    return {
      attendanceRate,
      scorePercentage,
      meetsMinimumAttendance: attendanceRate >= 25,
      meetsGraduateRequirements: attendanceRate >= 50 && scorePercentage >= 30,
      meetsDistinctionRequirements: attendanceRate >= 50 && scorePercentage >= 45
    }
  }

  const getGraduationStatusText = (status: number) => {
    switch (status) {
      case 0: return 'No Graduation - Below minimum attendance'
      case 1: return 'Attendee - Completed bootcamp'
      case 2: return 'Graduate - Met graduation requirements'
      case 3: return 'Distinction - Exceptional performance'
      default: return 'Unknown'
    }
  }

  const graduationStats = mockAttendees.reduce((acc, attendee) => {
    const record = mockAttendeeRecords[attendee]
    acc[record.graduationStatus] = (acc[record.graduationStatus] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to={`/bootcamp/${id}`}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Graduation Processing</h1>
          <p className="mt-2 text-gray-600">{bootcamp.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setProcessingMode('individual')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              processingMode === 'individual' 
                ? 'bg-primary-100 text-primary-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <User className="h-4 w-4 inline mr-1" />
            Individual
          </button>
          <button
            onClick={() => setProcessingMode('batch')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              processingMode === 'batch' 
                ? 'bg-primary-100 text-primary-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="h-4 w-4 inline mr-1" />
            Batch
          </button>
        </div>
      </div>

      {/* Graduation Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-primary-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Distinction</p>
              <p className="text-2xl font-bold text-gray-900">{graduationStats[3] || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-success-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Graduates</p>
              <p className="text-2xl font-bold text-gray-900">{graduationStats[2] || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-warning-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Attendees</p>
              <p className="text-2xl font-bold text-gray-900">{graduationStats[1] || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-error-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">No Graduation</p>
              <p className="text-2xl font-bold text-gray-900">{graduationStats[0] || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Graduation Criteria */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Graduation Criteria</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">No Graduation</h3>
            <p className="text-sm text-gray-600">Less than 25% attendance</p>
          </div>
          <div className="p-4 bg-warning-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Attendee</h3>
            <p className="text-sm text-gray-600">25%+ attendance but doesn't meet graduate requirements</p>
          </div>
          <div className="p-4 bg-success-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Graduate</h3>
            <p className="text-sm text-gray-600">50%+ attendance and 30%+ total score</p>
          </div>
          <div className="p-4 bg-primary-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Distinction</h3>
            <p className="text-sm text-gray-600">50%+ attendance and 45%+ total score</p>
          </div>
        </div>
      </div>

      {processingMode === 'individual' ? (
        /* Individual Processing */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Individual Graduation Processing</h2>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Attendee
              </label>
              <select
                value={selectedAttendee}
                onChange={(e) => setSelectedAttendee(e.target.value)}
                className="input-field max-w-md"
              >
                {mockAttendees.map((attendee, index) => (
                  <option key={attendee} value={attendee}>
                    Student {String.fromCharCode(65 + index)} - {attendee.slice(0, 6)}...{attendee.slice(-4)}
                  </option>
                ))}
              </select>
            </div>

            {selectedAttendee && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Current Performance</h3>
                    {(() => {
                      const record = mockAttendeeRecords[selectedAttendee]
                      const criteria = getGraduationCriteria(record)
                      
                      return (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Attendance Rate</span>
                            <span className="font-medium">{criteria.attendanceRate}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full"
                              style={{ width: `${criteria.attendanceRate}%` }}
                            />
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Score Percentage</span>
                            <span className="font-medium">{criteria.scorePercentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-success-600 h-2 rounded-full"
                              style={{ width: `${criteria.scorePercentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    })()}
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Graduation Status</h3>
                    {(() => {
                      const record = mockAttendeeRecords[selectedAttendee]
                      
                      return (
                        <div className="space-y-3">
                          <div className="p-4 rounded-lg border-2 border-dashed border-gray-200">
                            <div className="flex items-center gap-3">
                              <span className={`status-badge ${GraduationStatusColors[record.graduationStatus as keyof typeof GraduationStatusColors]}`}>
                                {GraduationStatus[record.graduationStatus as keyof typeof GraduationStatus]}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                              {getGraduationStatusText(record.graduationStatus)}
                            </p>
                          </div>
                          
                          <button
                            onClick={() => processIndividualGraduation(selectedAttendee)}
                            disabled={isProcessing}
                            className="btn-primary w-full disabled:opacity-50"
                          >
                            {isProcessing ? 'Processing...' : 'Process Graduation'}
                          </button>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Batch Processing */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Batch Graduation Processing</h2>
            <button
              onClick={processAllGraduations}
              disabled={isProcessing}
              className="btn-primary disabled:opacity-50"
            >
              {isProcessing ? 'Processing All...' : 'Process All Graduations'}
            </button>
          </div>
          
          <div className="divide-y divide-gray-200">
            {mockAttendees.map((attendee, index) => {
              const record = mockAttendeeRecords[attendee]
              const criteria = getGraduationCriteria(record)
              
              return (
                <div key={attendee} className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-medium">
                        {String.fromCharCode(65 + index)}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {attendee.slice(0, 6)}...{attendee.slice(-4)}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span>Attendance: {criteria.attendanceRate}%</span>
                        <span>Score: {criteria.scorePercentage}%</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`status-badge ${GraduationStatusColors[record.graduationStatus as keyof typeof GraduationStatusColors]}`}>
                        {GraduationStatus[record.graduationStatus as keyof typeof GraduationStatus]}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {getGraduationStatusText(record.graduationStatus)}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default GraduationProcessing