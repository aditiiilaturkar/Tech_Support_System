import { useState } from "react";
import {logo, Search, User, Setting, control}  from '../../images';

const SideBar = () => {
  const [open, setOpen] = useState(true);
  const Menus = [
    { title: "Accounts", src: "User", gap: false, img: User },
    { title: "Dashboard", src: "Chart_fill", img:User },
    { title: "Search", src: "Search" , img: Search},
    { title: "Setting", src: "Setting" , img: Setting},
  ];

  return (
    <div className="flex bg-black ">
      <div
        className={` ${
          open ? "w-62" : "w-20"
        } bg-dark-purple h-screen p-5  pt-8 relative duration-300`}
      >
        {/* <img
          src={control}
          className={`cursor-pointer -right-3 top-9 w-7  border-dark-purple
           border-2 rounded-full  ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        /> */}
        <div className="flex gap-x-4 items-center">
          <img
            src={logo}
            onClick={() => setOpen(!open)}
            className={`cursor-pointer duration-500 ${
              open && "rotate-[360deg]"
            }`}
          />
          <h1
            className={`text-white origin-left font-medium text-xl duration-200 ${
              !open && "scale-0"
            }`}
          >
          </h1>
        </div>
        <ul className="pt-6">
          {Menus.map((Menu, index) => (
            <li
              key={index}
              className={`flex  rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 
              ${Menu.gap ? "mt-9" : "mt-2"} ${
                index === 0 && "bg-light-white"
              } `}
            >
              <img src={Menu.img} />
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                {Menu.title}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="h-screen flex-1 p-7">
        {/* <h1 className="text-2xl font-semibold ">Home Page</h1> */}
      </div>
    </div>
  );
};
export default SideBar;