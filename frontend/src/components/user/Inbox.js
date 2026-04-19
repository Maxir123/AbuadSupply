import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { HiOutlineMail, HiOutlineSearch } from 'react-icons/hi';
import { format } from 'date-fns';

const Inbox = () => {
  // Sample messages (static placeholder – replace with real data later)
  const messages = [
    {
      id: 1,
      sender: 'Support Team',
      avatar: 'S',
      subject: 'Your order has been shipped',
      preview: 'Your order #12345 has been shipped and will arrive...',
      date: new Date(2025, 2, 15),
      read: false,
    },
    {
      id: 2,
      sender: 'John Doe',
      avatar: 'JD',
      subject: 'Question about your product',
      preview: 'Hi, I have a question regarding the item I purchased...',
      date: new Date(2025, 2, 14),
      read: true,
    },
    {
      id: 3,
      sender: 'Promotions',
      avatar: 'P',
      subject: 'Special offer just for you!',
      preview: 'Get 20% off on your next order. Limited time only...',
      date: new Date(2025, 2, 12),
      read: true,
    },
  ];

  return (
    <Box className="w-full bg-gray-50 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <Box className="max-w-7xl mx-auto">
        {/* Header */}
        <Box className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <Box className="flex items-center gap-2">
            <Box className="p-2 bg-blue-50 rounded-lg">
              <HiOutlineMail size={24} className="text-blue-500" />
            </Box>
            <Typography variant="h5" component="h1" className="text-2xl font-bold text-gray-900">
              Inbox
            </Typography>
            <span className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full">
              {messages.length}
            </span>
          </Box>
          {/* Optional search bar – commented out to keep simple */}
          {/* <Box className="relative">
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
            />
            <HiOutlineSearch className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </Box> */}
        </Box>

        {/* Message List */}
        <Box className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {messages.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !message.read ? 'bg-blue-50/20' : ''
                  }`}
                >
                  <Avatar
                    sx={{
                      bgcolor: !message.read ? '#3b82f6' : '#e5e7eb',
                      color: !message.read ? 'white' : '#6b7280',
                      width: 40,
                      height: 40,
                      fontSize: '1rem',
                      fontWeight: 500,
                    }}
                  >
                    {message.avatar}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <Typography className="font-medium text-gray-900 truncate">
                        {message.sender}
                      </Typography>
                      <Typography className="text-xs text-gray-500 whitespace-nowrap">
                        {format(message.date, 'MMM dd')}
                      </Typography>
                    </div>
                    <Typography className="text-sm font-medium text-gray-700 truncate">
                      {message.subject}
                    </Typography>
                    <Typography className="text-sm text-gray-500 truncate">
                      {message.preview}
                    </Typography>
                  </div>
                  {!message.read && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <HiOutlineMail size={32} className="text-gray-400" />
              </div>
              <Typography variant="h6" className="text-gray-900 font-medium mb-2">
                No messages yet
              </Typography>
              // Inside the empty state message
              <Typography className="text-gray-500 max-w-sm mx-auto">
                When you receive messages from sellers or support, they&apos;ll appear here.
              </Typography>
            </div>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Inbox;