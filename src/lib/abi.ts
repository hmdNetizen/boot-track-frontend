export const abi = [
  {
    type: "impl",
    name: "BootTrackImpl",
    interface_name: "boot_track::interfaces::iboot_track::IBootTrack",
  },
  {
    type: "struct",
    name: "core::byte_array::ByteArray",
    members: [
      {
        name: "data",
        type: "core::array::Array::<core::bytes_31::bytes31>",
      },
      {
        name: "pending_word",
        type: "core::felt252",
      },
      {
        name: "pending_word_len",
        type: "core::integer::u32",
      },
    ],
  },
  {
    type: "struct",
    name: "core::integer::u256",
    members: [
      {
        name: "low",
        type: "core::integer::u128",
      },
      {
        name: "high",
        type: "core::integer::u128",
      },
    ],
  },
  {
    type: "enum",
    name: "core::bool",
    variants: [
      {
        name: "False",
        type: "()",
      },
      {
        name: "True",
        type: "()",
      },
    ],
  },
  {
    type: "struct",
    name: "boot_track::types::attendees::Bootcamp",
    members: [
      {
        name: "name",
        type: "core::byte_array::ByteArray",
      },
      {
        name: "organizer",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "total_weeks",
        type: "core::integer::u8",
      },
      {
        name: "sessions_per_week",
        type: "core::integer::u8",
      },
      {
        name: "assignment_max_score",
        type: "core::integer::u16",
      },
      {
        name: "is_active",
        type: "core::bool",
      },
      {
        name: "created_at",
        type: "core::integer::u64",
      },
      {
        name: "num_of_attendees",
        type: "core::integer::u32",
      },
    ],
  },
  {
    type: "struct",
    name: "boot_track::types::attendees::AttendeeRecord",
    members: [
      {
        name: "is_registered",
        type: "core::bool",
      },
      {
        name: "attendance_count",
        type: "core::integer::u8",
      },
      {
        name: "total_assignment_score",
        type: "core::integer::u16",
      },
      {
        name: "graduation_status",
        type: "core::integer::u8",
      },
    ],
  },
  {
    type: "struct",
    name: "boot_track::types::attendees::AssignmentGrade",
    members: [
      {
        name: "score",
        type: "core::integer::u16",
      },
      {
        name: "graded_by",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "graded_at",
        type: "core::integer::u64",
      },
    ],
  },
  {
    type: "interface",
    name: "boot_track::interfaces::iboot_track::IBootTrack",
    items: [
      {
        type: "function",
        name: "create_bootcamp",
        inputs: [
          {
            name: "name",
            type: "core::byte_array::ByteArray",
          },
          {
            name: "num_of_attendees",
            type: "core::integer::u32",
          },
          {
            name: "total_weeks",
            type: "core::integer::u8",
          },
          {
            name: "sessions_per_week",
            type: "core::integer::u8",
          },
          {
            name: "assignment_max_score",
            type: "core::integer::u16",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "register_attendees",
        inputs: [
          {
            name: "bootcamp_id",
            type: "core::integer::u256",
          },
          {
            name: "attendees",
            type: "core::array::Array::<core::starknet::contract_address::ContractAddress>",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "add_tutor",
        inputs: [
          {
            name: "bootcamp_id",
            type: "core::integer::u256",
          },
          {
            name: "tutor_address",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "open_attendance",
        inputs: [
          {
            name: "bootcamp_id",
            type: "core::integer::u256",
          },
          {
            name: "week",
            type: "core::integer::u8",
          },
          {
            name: "session_id",
            type: "core::integer::u8",
          },
          {
            name: "duration_minutes",
            type: "core::integer::u32",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "mark_attendance",
        inputs: [
          {
            name: "bootcamp_id",
            type: "core::integer::u256",
          },
          {
            name: "week",
            type: "core::integer::u8",
          },
          {
            name: "session_id",
            type: "core::integer::u8",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "close_attendance",
        inputs: [
          {
            name: "bootcamp_id",
            type: "core::integer::u256",
          },
          {
            name: "week",
            type: "core::integer::u8",
          },
          {
            name: "session_id",
            type: "core::integer::u8",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "grade_assignment",
        inputs: [
          {
            name: "bootcamp_id",
            type: "core::integer::u256",
          },
          {
            name: "week",
            type: "core::integer::u8",
          },
          {
            name: "attendee",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "score",
            type: "core::integer::u16",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "batch_grade_assignments",
        inputs: [
          {
            name: "bootcamp_id",
            type: "core::integer::u256",
          },
          {
            name: "week",
            type: "core::integer::u8",
          },
          {
            name: "attendees",
            type: "core::array::Array::<core::starknet::contract_address::ContractAddress>",
          },
          {
            name: "scores",
            type: "core::array::Array::<core::integer::u16>",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "process_graduation",
        inputs: [
          {
            name: "bootcamp_id",
            type: "core::integer::u256",
          },
          {
            name: "attendee",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u8",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "process_all_graduations",
        inputs: [
          {
            name: "bootcamp_id",
            type: "core::integer::u256",
          },
          {
            name: "attendees",
            type: "core::array::Array::<core::starknet::contract_address::ContractAddress>",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "get_all_bootcamps",
        inputs: [],
        outputs: [
          {
            type: "core::array::Array::<(core::integer::u256, boot_track::types::attendees::Bootcamp)>",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_attendee_stats",
        inputs: [
          {
            name: "bootcamp_id",
            type: "core::integer::u256",
          },
          {
            name: "attendee",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "(core::integer::u8, core::integer::u16, core::integer::u8, core::integer::u8)",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_all_attendees",
        inputs: [
          {
            name: "bootcamp_id",
            type: "core::integer::u256",
          },
        ],
        outputs: [
          {
            type: "core::array::Array::<(core::starknet::contract_address::ContractAddress, boot_track::types::attendees::AttendeeRecord)>",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_bootcamp_info",
        inputs: [
          {
            name: "bootcamp_id",
            type: "core::integer::u256",
          },
        ],
        outputs: [
          {
            type: "(core::byte_array::ByteArray, core::integer::u8, core::integer::u8, core::integer::u16, core::integer::u32, core::bool, core::integer::u64)",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "is_attendance_open",
        inputs: [
          {
            name: "bootcamp_id",
            type: "core::integer::u256",
          },
          {
            name: "week",
            type: "core::integer::u8",
          },
          {
            name: "session_id",
            type: "core::integer::u8",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "debug_bootcamp_data",
        inputs: [
          {
            name: "bootcamp_id",
            type: "core::integer::u256",
          },
        ],
        outputs: [
          {
            type: "(core::starknet::contract_address::ContractAddress, core::starknet::contract_address::ContractAddress, core::byte_array::ByteArray, core::bool)",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_assignment_info",
        inputs: [
          {
            name: "bootcamp_id",
            type: "core::integer::u256",
          },
          {
            name: "attendee",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "week",
            type: "core::integer::u8",
          },
        ],
        outputs: [
          {
            type: "boot_track::types::attendees::AssignmentGrade",
          },
        ],
        state_mutability: "view",
      },
    ],
  },
  {
    type: "constructor",
    name: "constructor",
    inputs: [
      {
        name: "owner",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    type: "event",
    name: "boot_track::events::boot_track::BootcampCreated",
    kind: "struct",
    members: [
      {
        name: "bootcamp_id",
        type: "core::integer::u256",
        kind: "data",
      },
      {
        name: "name",
        type: "core::byte_array::ByteArray",
        kind: "data",
      },
      {
        name: "organizer",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "boot_track::events::boot_track::AttendeeRegistered",
    kind: "struct",
    members: [
      {
        name: "bootcamp_id",
        type: "core::integer::u256",
        kind: "data",
      },
      {
        name: "attendee",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "boot_track::events::boot_track::TutorAdded",
    kind: "struct",
    members: [
      {
        name: "bootcamp_id",
        type: "core::integer::u256",
        kind: "data",
      },
      {
        name: "tutor",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "boot_track::events::boot_track::AttendanceOpened",
    kind: "struct",
    members: [
      {
        name: "bootcamp_id",
        type: "core::integer::u256",
        kind: "data",
      },
      {
        name: "week",
        type: "core::integer::u8",
        kind: "data",
      },
      {
        name: "session_id",
        type: "core::integer::u8",
        kind: "data",
      },
      {
        name: "duration_minutes",
        type: "core::integer::u32",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "boot_track::events::boot_track::AttendanceMarked",
    kind: "struct",
    members: [
      {
        name: "bootcamp_id",
        type: "core::integer::u256",
        kind: "data",
      },
      {
        name: "week",
        type: "core::integer::u8",
        kind: "data",
      },
      {
        name: "session_id",
        type: "core::integer::u8",
        kind: "data",
      },
      {
        name: "attendee",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "boot_track::events::boot_track::AttendanceClosed",
    kind: "struct",
    members: [
      {
        name: "bootcamp_id",
        type: "core::integer::u256",
        kind: "data",
      },
      {
        name: "week",
        type: "core::integer::u8",
        kind: "data",
      },
      {
        name: "session_id",
        type: "core::integer::u8",
        kind: "data",
      },
      {
        name: "total_attendees",
        type: "core::integer::u32",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "boot_track::events::boot_track::AssignmentGraded",
    kind: "struct",
    members: [
      {
        name: "bootcamp_id",
        type: "core::integer::u256",
        kind: "data",
      },
      {
        name: "week",
        type: "core::integer::u8",
        kind: "data",
      },
      {
        name: "attendee",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "score",
        type: "core::integer::u16",
        kind: "data",
      },
      {
        name: "graded_by",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "boot_track::events::boot_track::GraduationProcessed",
    kind: "struct",
    members: [
      {
        name: "bootcamp_id",
        type: "core::integer::u256",
        kind: "data",
      },
      {
        name: "attendee",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "graduation_status",
        type: "core::integer::u8",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "boot_track::boot_track::BootTrack::Event",
    kind: "enum",
    variants: [
      {
        name: "BootcampCreated",
        type: "boot_track::events::boot_track::BootcampCreated",
        kind: "nested",
      },
      {
        name: "AttendeeRegistered",
        type: "boot_track::events::boot_track::AttendeeRegistered",
        kind: "nested",
      },
      {
        name: "TutorAdded",
        type: "boot_track::events::boot_track::TutorAdded",
        kind: "nested",
      },
      {
        name: "AttendanceOpened",
        type: "boot_track::events::boot_track::AttendanceOpened",
        kind: "nested",
      },
      {
        name: "AttendanceMarked",
        type: "boot_track::events::boot_track::AttendanceMarked",
        kind: "nested",
      },
      {
        name: "AttendanceClosed",
        type: "boot_track::events::boot_track::AttendanceClosed",
        kind: "nested",
      },
      {
        name: "AssignmentGraded",
        type: "boot_track::events::boot_track::AssignmentGraded",
        kind: "nested",
      },
      {
        name: "GraduationProcessed",
        type: "boot_track::events::boot_track::GraduationProcessed",
        kind: "nested",
      },
    ],
  },
] as const;
