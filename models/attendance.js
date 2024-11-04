const mongoose = require('mongoose');

// Define the Attendance schema
const attendanceSchema = new mongoose.Schema({
  record_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Record',  // Reference to the records collection
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  verification: {
    method: {
      type: String,
      enum: ['face_recognition'],  // Supports only face recognition at the moment
      default: 'face_recognition'
    },
    confidence: {
      type: Number,
      required: true
    },
    anti_spoof_score: {
      type: Number,
      required: true
    }
  },
  details: {
    fatherName: { type: String, trim: true },
    mobileNumber: { type: String, trim: true },
    bloodGroup: { type: String, trim: true },
    emergencyContactNumber: { type: String, trim: true }
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'leave'],
    default: 'present'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true  // Adds createdAt and updatedAt timestamps automatically
});

// Indexes for performance
attendanceSchema.index({ record_id: 1, timestamp: -1 });
attendanceSchema.index({ timestamp: -1 });
attendanceSchema.index({ status: 1 });

// Compound index to avoid duplicate entries within a 30-minute timeframe
attendanceSchema.index(
  { record_id: 1, timestamp: 1 },
  {
    unique: true,
    partialFilterExpression: {
      timestamp: {
        $gt: new Date(Date.now() - 30 * 60 * 1000)  // Last 30 minutes
      }
    }
  }
);

// Virtual populate to fetch associated record details
attendanceSchema.virtual('record', {
  ref: 'Record',
  localField: 'record_id',
  foreignField: '_id',
  justOne: true
});

// Instance method to return formatted attendance data
attendanceSchema.methods.toJSON = function() {
  const attendance = this.toObject();
  return {
    id: attendance._id,
    record_id: attendance.record_id,
    name: attendance.name,
    role: attendance.role,
    timestamp: attendance.timestamp,
    verification: attendance.verification,
    status: attendance.status,
    details: attendance.details,
    created_at: attendance.created_at
  };
};

// Static method to fetch today's attendance
attendanceSchema.statics.getTodayAttendance = async function() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  return this.aggregate([
    {
      $match: {
        timestamp: { $gte: startOfDay }
      }
    },
    {
      $lookup: {
        from: 'records',
        localField: 'record_id',
        foreignField: '_id',
        as: 'record'
      }
    },
    { $unwind: '$record' },
    {
      $project: {
        id: '$_id',
        record_id: 1,
        name: 1,
        role: 1,
        timestamp: 1,
        verification: 1,
        status: 1,
        details: 1,
        record: {
          name: '$record.name',
          role: '$record.role',
          picture: '$record.picture'
        }
      }
    },
    { $sort: { timestamp: -1 } }
  ]);
};

// Static method to fetch attendance by date range and optional record_id
attendanceSchema.statics.getAttendanceByDateRange = async function(startDate, endDate, record_id = null) {
  const match = {
    timestamp: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  };

  if (record_id) {
    match.record_id = mongoose.Types.ObjectId(record_id);
  }

  return this.aggregate([
    { $match: match },
    {
      $lookup: {
        from: 'records',
        localField: 'record_id',
        foreignField: '_id',
        as: 'record'
      }
    },
    { $unwind: '$record' },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          record_id: '$record_id'
        },
        name: { $first: '$name' },
        role: { $first: '$role' },
        attendance_count: { $sum: 1 },
        verifications: {
          $push: {
            timestamp: '$timestamp',
            confidence: '$verification.confidence',
            anti_spoof_score: '$verification.anti_spoof_score'
          }
        }
      }
    },
    { $sort: { '_id.date': -1 } }
  ]);
};

// Export the model
module.exports = mongoose.model('Attendance', attendanceSchema);
