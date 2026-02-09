# How to Export Diagrams from the User Flow Guide

## 🎯 Quick Method: Use Mermaid Live Editor (2 minutes each)

### Step 1: Open Mermaid Live Editor
Go to: **https://mermaid.live**

### Step 2: Copy & Paste Each Diagram Code

---

## 📊 DIAGRAM 1: Website Flow

Copy this code and paste into the editor:

```mermaid
flowchart TD
    subgraph Main["🌐 Website Pages"]
        HOME["🏠 Home Page"]
        CHAT["💬 Chat Page"]
        LOGIN["🔐 Login Page"]
        DASH["📊 Dashboard"]
        LEADS["📋 Leads Page"]
    end

    HOME -->|"Start Consultation"| CHAT
    HOME -->|"Log in"| LOGIN
    LOGIN -->|"Admin Login"| DASH
    DASH -->|"View Leads"| LEADS
    
    style HOME fill:#e8f5e9,stroke:#2e7d32
    style CHAT fill:#e3f2fd,stroke:#1565c0
    style LOGIN fill:#fff3e0,stroke:#ef6c00
    style DASH fill:#fce4ec,stroke:#c2185b
    style LEADS fill:#f3e5f5,stroke:#7b1fa2
```

---

## 📊 DIAGRAM 2: Chat Conversation Flow

```mermaid
flowchart TD
    START["🚀 User Opens Chat"]
    
    START --> GREET["👋 Bot Says Hello"]
    
    GREET --> DETECT{"🔍 What does user want?"}
    
    DETECT -->|"Construction"| CONFIRM_S["✅ Confirm Service"]
    DETECT -->|"Interiors"| CONFIRM_S
    DETECT -->|"Real Estate"| CONFIRM_S
    DETECT -->|"Events"| CONFIRM_S
    DETECT -->|"Says Hi"| MENU["📋 Show 5 Services"]
    
    MENU --> PICK["User Picks Service"]
    PICK --> CONFIRM_S
    
    CONFIRM_S --> CONFIRM{"Confirms?"}
    
    CONFIRM -->|"Yes ✓"| Q1
    CONFIRM -->|"No ✗"| MENU
    
    Q1["Q1: Project Type?"]
    Q2["Q2: Budget Range?"]
    Q3["Q3: Timeline?"]
    
    Q1 --> Q2 --> Q3
    
    Q3 --> LOC["📍 Location"]
    LOC --> NAME["👤 Name"]
    NAME --> PHONE["📱 Phone"]
    
    PHONE --> LEAD["✅ Lead Created!"]
    
    LEAD --> COMPLETE["🎉 Chat Complete"]
    
    style START fill:#c8e6c9,stroke:#2e7d32
    style LEAD fill:#fff9c4,stroke:#f9a825
    style COMPLETE fill:#b3e5fc,stroke:#0288d1
```

---

## 📊 DIAGRAM 3: The 5 Service Brands

```mermaid
mindmap
  root((Area24One))
    Construction
      Atha Construction
      New Homes
      Renovations
      Commercial
    Interiors
      Nesthetix Design
      Home Interiors
      Office Design
      Kitchens
    Real Estate
      Area24 Realty
      Buy Property
      Sell Property
      Investments
    Development
      Area24 Developers
      Land Projects
      Townships
      Complexes
    Events
      The Stage 365
      Corporate
      Weddings
      Brand Events
```

---

## 📊 DIAGRAM 4: Login & Admin Flow

```mermaid
flowchart LR
    subgraph Public["🌍 Anyone Can Access"]
        HOME["Home Page"]
        CHAT["Chat Page"]
    end
    
    subgraph Login["🔐 Login Required"]
        GOOGLE["Login with Google"]
    end
    
    subgraph Admin["👑 Admin Only"]
        DASH["Dashboard"]
        LEADS["Leads List"]
    end
    
    HOME --> GOOGLE
    GOOGLE --> DASH
    DASH --> LEADS
    
    style Public fill:#e8f5e9
    style Admin fill:#ffebee
```

---

## 📊 DIAGRAM 5: User Journey

```mermaid
journey
    title A Visitor Exploring Area24One
    section Arrival
      Opens Website: 5: Visitor
      Views Hero Section: 4: Visitor
    section Exploration
      Reads About Services: 4: Visitor
      Views FAQ: 3: Visitor
    section Action
      Clicks Start Consultation: 5: Visitor
      Begins Chat: 5: Visitor
```

---

## Step 3: Download Each Diagram

1. After pasting the code, the diagram will appear on the RIGHT side
2. Click the **"Actions"** button (or download icon) in the toolbar
3. Select **"PNG"** or **"SVG"** format
4. Save to your computer
5. Insert into your Word document

---

## 🎨 Alternative: Use VS Code Preview

If you have VS Code installed:
1. Open the `user_flow_guide.md` file
2. Install the "Markdown Preview Mermaid Support" extension
3. Press `Ctrl + Shift + V` to preview
4. Right-click diagrams to save as images

---

## 📁 Files Created

| File | Location |
|------|----------|
| Word Document | `C:\Jerry\Workspace\Area24one\Area24One_User_Flow_Guide.docx` |
| This Guide | `C:\Jerry\Workspace\Area24one\diagram_export_guide.md` |
