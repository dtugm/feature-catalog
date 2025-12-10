"use client";

import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { useState } from "react";

export const LanguageSwitch = () => {
  const [lang, setLang] = useState("EN");

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="light">
          {lang}
        </Button>
      </DropdownTrigger>
      <DropdownMenu 
        aria-label="Language selection" 
        onAction={(key) => setLang(key as string)}
        selectedKeys={new Set([lang])}
        selectionMode="single"
      >
        <DropdownItem key="EN">English</DropdownItem>
        <DropdownItem key="ID">Bahasa Indonesia</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
