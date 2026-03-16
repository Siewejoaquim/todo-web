import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#352323] text-[#352323]">
  
      <aside className="w-64 bg-white shadow-md flex flex-col p-6">
       
        <div className="flex items-center space-x-3 mb-8">
          <img
            src="j.jpg"
            alt="Profile"
            className="h-10 w-10 rounded-full"
          />
          <span className="font-semibold text-[#352323]">Ayimboh jesie</span>
        </div>

     
        <nav className="flex flex-col space-y-4 text-sm">
          <div>
            <p className="font-bold text-[#C47623] mb-2">Today tasks</p>
            <ul className="space-y-2">
              <li className="hover:text-[#C47623] cursor-pointer">Personal</li>
              <li className="hover:text-[#C47623] cursor-pointer">Freelance</li>
              <li className="hover:text-[#C47623] cursor-pointer">Work</li>
              <li className="hover:text-[#C47623] cursor-pointer">+ Add filter</li>
            </ul>
          </div>
          <p className="hover:text-[#C47623] cursor-pointer">Scheduled tasks</p>
          <p className="hover:text-[#C47623] cursor-pointer">Settings</p>
        </nav>
      </aside>

    
      <main className="flex-1 bg-gray-100 p-8">
        
        <h1 className="text-xl font-bold text-[#352323] mb-4">
          Today main focus <span className="text-[#C47623]">Design team meeting</span>
        </h1>

       
        <div className="mb-6">
          <input
            type="text"
            placeholder="What is your next task?"
            className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-[#C47623] focus:ring-1 focus:ring-[#C47623]"
          />
        </div>

        <ul className="space-y-4">
          <li className="flex justify-between items-center bg-pink-100 px-4 py-2 rounded-md shadow">
            <span className="font-medium text-[#352323]">Work out</span>
            <span className="text-sm text-gray-600">8:00 am</span>
          </li>
          <li className="flex justify-between items-center bg-yellow-100 px-4 py-2 rounded-md shadow">
            <span className="font-medium text-[#352323]">Design team meeting</span>
            <span className="text-sm text-gray-600">2:30 pm</span>
          </li>
          <li className="flex justify-between items-center bg-blue-100 px-4 py-2 rounded-md shadow">
            <span className="font-medium text-[#352323]">Hand off the project</span>
            <span className="text-sm text-gray-600">7:00 pm</span>
          </li>
          <li className="flex justify-between items-center bg-red-100 px-4 py-2 rounded-md shadow">
            <span className="font-medium text-[#352323]">Read 5 pages of "Sprint"</span>
            <span className="text-sm text-gray-600">10:30 pm</span>
          </li>
        </ul>
      </main>
    </div>
  );
};

export default Dashboard;