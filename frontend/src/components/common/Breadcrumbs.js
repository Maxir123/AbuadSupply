import React from "react";
import Link from "next/link";
import { capitalizeWords } from "@/lib/utils";

const Breadcrumbs = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav className="text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" legacyBehavior>
            <a className="text-blue-600 hover:underline">Home</a>
          </Link>
        </li>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li>
              {item.href ? (
                <Link href={item.href} legacyBehavior>
                  <a className="text-blue-600 hover:underline">
                    {capitalizeWords(item.label)}
                  </a>
                </Link>
              ) : (
                <span className="text-gray-800 font-medium">
                  {capitalizeWords(item.label)}
                </span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
