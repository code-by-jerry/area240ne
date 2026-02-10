# Cost Estimator Documentation

This document provides a detailed technical overview of the "Home Construction Cost Calculator" feature. It explains the end-to-end logic, calculation formulas, location handling, and Floor Area Ratio (FAR) implementation.

## 1. Overview

The Cost Estimator is a client-side calculator implemented using **Alpine.js** within a Laravel Blade template (`resources/views/cost-estimation.blade.php`). It allows users to estimate construction costs based on their plot area, location, number of floors, and selected construction package.

## 2. Core Components

### 2.1. Location Handling & FAR (Floor Area Ratio)

The system currently supports specific cities in Karnataka. Each city is assigned a **Floor Area Ratio (FAR)** value, which determines the maximum allowable built-up area relative to the plot size.

**Configuration:**
- **State:** Karnataka (Hardcoded in Controller)
- **Cities:** Bangalore, Ballari, Mysore
- **Default FAR:** 1.75

**FAR Values Mapping:**
| City | FAR Value |
| :--- | :--- |
| Bangalore | 1.75 |
| Ballari | 1.75 |
| Mysore | 1.50 |
| *Default* | 1.75 |

**Code Reference:**
- **Controller:** `app/Http/Controllers/HomeController.php` passes the list of states and cities.
- **Frontend (Alpine.js):** `farValues` object maps cities to their FAR multipliers.

### 2.2. Input Parameters

The user provides the following inputs:
1.  **State & City:** Determines the FAR value.
2.  **Plot Area (sq.ft):** The total area of the land.
3.  **Number of Floors:** The desired number of floors to build (G, G+1, G+2, etc.).
4.  **Package:** The construction package (e.g., Basic, Standard, Premium), which determines the **Price Per Sq.ft**.

## 3. Calculation Logic (End-to-End)

The calculation workflow is triggered whenever the user modifies the inputs.

### Step 1: Determine FAR Value
Based on the selected city, the system retrieves the FAR value.
```javascript
farValue = farValues[selectedCity] || farValues['Default'];
```

### Step 2: Calculate Maximum Built-up Area
This represents the total allowable construction area across all floors, mandated by government regulations (approximated here).
```javascript
maxBuiltup = Math.floor(plotArea * farValue);
```

### Step 3: Calculate Recommended Built-up Area Per Floor
The system assumes a standard **75% Ground Coverage** (leaving 25% for setbacks/open space).
```javascript
builtupPerFloor = Math.floor(plotArea * 0.75);
```

### Step 4: Calculate Recommended Maximum Floors
This is an informational metric to guide the user on how many floors they can typically build within the FAR limit.
```javascript
maxFloors = Math.floor(maxBuiltup / builtupPerFloor);
// Minimum of 1 floor is enforced for display
if (maxFloors < 1) maxFloors = 1;
```
*Note: The user is allowed to manually select more floors than this recommendation; it serves only as a guideline.*

### Step 5: Calculate Total Built-up Area
This is the actual area that will be constructed based on the user's selection.
```javascript
totalBuiltupArea = builtupPerFloor * selectedFloors;
```

### Step 6: Calculate Estimated Cost
The final cost is derived by multiplying the total built-up area by the selected package's rate.
```javascript
pricePerSqft = selectedPackageData.price_per_sqft;
calculatedCost = totalBuiltupArea * pricePerSqft;
```

## 4. Data Flow Example

**Scenario:**
- **Location:** Bangalore (FAR: 1.75)
- **Plot Area:** 1,200 sq.ft
- **Package Rate:** ₹2,000 / sq.ft
- **User Selection:** G+2 (3 Floors)

**Execution:**

1.  **FAR Lookup:** `1.75` (for Bangalore)
2.  **Max Built-up (Limit):**
    `1,200 * 1.75 = 2,100 sq.ft`
3.  **Built-up Per Floor (75% coverage):**
    `1,200 * 0.75 = 900 sq.ft`
4.  **Recommended Max Floors:**
    `2,100 / 900 = 2.33` -> **2 Floors (G+1)**
5.  **Actual Total Built-up (User chose 3 floors):**
    `900 * 3 = 2,700 sq.ft`
6.  **Estimated Cost:**
    `2,700 * 2,000 = ₹54,00,000`

## 5. Technical Implementation Details

- **Framework:** Laravel 10 + Alpine.js
- **File:** `resources/views/cost-estimation.blade.php`
- **State Management:** Alpine.js `x-data` object holds all reactive variables (`plotArea`, `calculatedCost`, `farValues`, etc.).
- **Reactivity:** `calculateFromPlot()` and `calculateCost()` methods are called on input events (`@input`, `@change`) to update the UI in real-time.
- **Form Submission:**
    - The form submits to `contact.submit` route.
    - Upon success, it redirects to a "Thank You" page (`cost-estimation.thank-you`), passing the calculated values via URL parameters for display.

## 6. Future Extensibility

To add more cities or states:
1.  Update `HomeController.php` to include the new city in the `$states` array.
2.  Update the `farValues` object in `cost-estimation.blade.php` with the specific FAR value for the new city.
