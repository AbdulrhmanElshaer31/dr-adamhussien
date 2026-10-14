import React from "react"

export const SmileMark: React.FC<{ light?: boolean; className?: string }> = ({
  light = false,
  className = "",
}) => {
  return (
    <svg
      className={`smile-mark ${className}`}
      viewBox="0 0 120 62"
      aria-hidden="true"
    >
      <path
        d="M8 13c9 48 92 54 104 0"
        fill="none"
        stroke={light ? "#F7F5EF" : "#174E49"}
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M92 8l2.7 7.3L102 18l-7.3 2.7L92 28l-2.7-7.3L82 18l7.3-2.7L92 8Z"
        fill="#E9C8A9"
      />
    </svg>
  )
}

export const Logo: React.FC<{ light?: boolean; subtitle?: string }> = ({
  light = false,
  subtitle = "Dental Studio",
}) => {
  return (
    <div className={`logo ${light ? "logo-light" : ""}`}>
      <span className="logo-symbol">
        <SmileMark light={light} />
      </span>
      <span>
        <b>LUMA</b>
        <small>{subtitle}</small>
      </span>
    </div>
  )
}
