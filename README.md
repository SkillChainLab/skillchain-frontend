# 🚀 SkillChain Frontend

A modern, decentralized freelancing platform built on blockchain technology. Connect talent with opportunity through secure, transparent smart contracts and cryptocurrency payments.

## 🌟 **Project Overview**

SkillChain is a revolutionary freelancing platform that leverages blockchain technology to create a trustless, transparent marketplace where freelancers and employers can collaborate directly without intermediaries.

### **Key Features**
- 🔗 **Blockchain Integration** - Built on Cosmos SDK with custom SkillChain network
- 💰 **Dual Token System** - SKILL tokens and stable VUSD for payments
- 🌐 **Decentralized** - No intermediaries, direct peer-to-peer transactions
- 🔒 **Secure Wallet Integration** - Keplr wallet support
- 📊 **Real-time API** - RESTful API for all blockchain operations
- 🎨 **Modern UI/UX** - Beautiful, responsive design with Tailwind CSS
- 🪙 **Token Faucet** - Get test tokens for development

## 🛠 **Technology Stack**

- **Frontend:** Next.js 15.3, React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **Blockchain:** CosmJS, Cosmos SDK
- **Wallet:** Keplr Wallet Integration
- **API:** Axios, RESTful endpoints
- **State Management:** React Context API

## 🚀 **Quick Start**

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Keplr wallet extension
- SkillChain blockchain node running

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/skillchain-frontend.git
cd skillchain-frontend

# Install dependencies
npm install

# Copy environment variables
cp env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔧 **API Integration**

The application integrates with SkillChain's REST API endpoints on virtual server:

### **Live Server URLs:**
- **Tendermint RPC:** `http://45.83.20.3:26657`
- **REST API:** `http://45.83.20.3:1317`
- **Token Faucet:** `http://45.83.20.3:4500`

### **Available APIs:**
- **Bank Operations** - Balance queries and token operations
- **Conversion APIs** - SKILL ↔ VUSD conversion
- **Marketplace** - Job posting, proposals, project management
- **Profile Management** - User profiles, skills, endorsements
- **Social Features** - User connections, messaging, notifications
- **File Storage** - IPFS integration for file uploads
- **Analytics** - Platform metrics and user statistics

## 🪙 **Getting Test Tokens**

Use the token faucet to get test tokens for development:

```bash
# Get SKILL tokens
curl -X POST http://45.83.20.3:4500/faucet -H "Content-Type: application/json" -d '{"address": "your-skill-address"}'

# Get VUSD tokens  
curl -X POST http://45.83.20.3:4500/faucet/vusd -H "Content-Type: application/json" -d '{"address": "your-skill-address"}'
```

## 🔗 **API Endpoints Documentation**

See `skillchain-api-endpoints.md` for complete API documentation including:
- Query endpoints (GET)
- Transaction endpoints (POST)  
- Request/response formats
- Example workflows
- Error handling

## 🧪 **Development Workflow**

### **1. Connect Wallet**
```typescript
const { connectWallet, walletInfo } = useWallet()
await connectWallet()
```

### **2. Create Job Posting**
```typescript
import { marketplaceApi } from '@/lib/api'

const result = await marketplaceApi.createJob({
  employer_address: walletInfo.address,
  title: "React Developer Needed",
  description: "Building e-commerce platform",
  budget: "5000",
  skills: ["React", "Node.js"],
  deadline: "2024-02-15"
})
```

### **3. Convert Tokens**
```typescript
import { conversionApi } from '@/lib/api'

const result = await conversionApi.convertSkillToVUSD({
  from_address: walletInfo.address,
  amount: "1000000000" // 1000 SKILL in micro units
})
```

## 🌐 **Environment Setup**

### **SkillChain Virtual Server Network**
The application connects to SkillChain blockchain running on virtual server:
- RPC endpoint: `http://45.83.20.3:26657`
- REST endpoint: `http://45.83.20.3:1317`
- Chain ID: `skillchain`
- Faucet: `http://45.83.20.3:4500`

### **Keplr Configuration**
The application automatically configures Keplr with SkillChain network settings:
- Bech32 prefix: `skill`
- Native tokens: SKILL (uskill) and VUSD (uvusd)
- Fee configuration for transactions

## 🚀 **Deployment**

### **Production Build**
```bash
npm run build
npm start
```

### **Vercel Deployment**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 🔒 **Security Features**

- ✅ **Wallet-based Authentication** - No passwords or centralized auth
- ✅ **Transaction Signing** - All transactions signed locally
- ✅ **Input Validation** - Form validation and sanitization
- ✅ **Error Handling** - Comprehensive error catching and user feedback
- ✅ **Type Safety** - Full TypeScript implementation

## 🤝 **Contributing**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 **Links**

- [Live Demo](https://skillchain-frontend.vercel.app)
- [API Documentation](./skillchain-api-endpoints.md)
- [SkillChain Blockchain](https://github.com/your-org/skillchain)
- [Keplr Wallet](https://wallet.keplr.app)

## 🛠 **Next Steps**

- [ ] **Real Blockchain Integration** - Connect to live SkillChain network
- [ ] **Advanced Filtering** - Enhanced search and filter capabilities  
- [ ] **Real-time Notifications** - WebSocket integration
- [ ] **Mobile App** - React Native version
- [ ] **Advanced Analytics** - User and marketplace analytics
- [ ] **Multi-language Support** - i18n implementation

---

**Built with ❤️ by the SkillChain Team**
