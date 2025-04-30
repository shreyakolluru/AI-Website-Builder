'use client';
import { UserDetailContext } from '@/context/UserDetailContext';
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { useSidebar } from '../ui/sidebar';

function WorkspaceHistory() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [workspaceList, setWorkSpaceList] = useState([]);
  const convex = useConvex();
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    if (userDetail?._id) {
      GetAllWorkspace();
    } else {
      setWorkSpaceList([]); // Reset workspace list if no userId
    }
  }, [userDetail]);

  const GetAllWorkspace = async () => {
    try {
      const result = await convex.query(api.workspace.GetAllWorkspace, {
        userId: userDetail._id,
      });
      setWorkSpaceList(result || []);
    } catch (error) {
      console.error('Failed to fetch workspaces:', error);
      setWorkSpaceList([]);
    }
  };

  return (
    <div>
      <h2 className="font-medium text-lg">Your Chats</h2>
      <div>
        {workspaceList.length === 0 ? (
          <p className="text-sm text-gray-400 mt-2">No chats available</p>
        ) : (
          workspaceList.map((workspace, index) => (
            <Link key={index} href={`/workspace/${workspace._id}`}>
              <h2
                onClick={toggleSidebar}
                className="text-sm text-gray-400 mt-2 font-light hover:text-white cursor-pointer"
              >
                {workspace?.messages[0]?.content || 'Untitled Chat'}
              </h2>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default WorkspaceHistory;