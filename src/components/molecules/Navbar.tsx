import React from 'react';

const Navbar = () => {
  
  return (
    <nav className=' bg-gray-800'>
     <div className='container mx-auto py-4 flex justify-between'>
      <div>
        website name
      </div>

      <div>
        <ul className='flex gap-3'>
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </div>
      <div className='flex gap-7'>
        <button>Sign in</button>
        <button>Sign up</button>
      </div>

     </div>
    
      
    </nav>
  );
};

export default Navbar;