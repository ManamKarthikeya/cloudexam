/**
 * Infosys FA2 Cloud Examination - Question Bank
 * Total Questions: 27
 * Marks: 40 (18 x 1 mark + 5 x 2 marks + 4 x 3 marks)
 * Negative marking: 25% of question weight (-0.25, -0.50, -0.75)
 */

const QUESTION_BANK = [
  // SECTION A: 1-mark questions (Q1 - Q18)
  {
    id: 1,
    section: "Section A: 1-mark questions",
    title: "Selecting a deployment model",
    text: "A bank needs greater control over sensitive customer records, data location and its cloud environment. Which deployment model is most suitable?",
    type: "single",
    marks: 1,
    negativeMarks: 0.25,
    options: [
      { id: "A", text: "Public cloud" },
      { id: "B", text: "Private cloud" },
      { id: "C", text: "Community cloud" },
      { id: "D", text: "Hybrid cloud" }
    ],
    correct: ["B"],
    explanation: "A Private Cloud is provisioned for exclusive use by a single organization. It delivers maximum control over data governance, regulatory compliance, infrastructure isolation, and physical data location, making it the most suitable choice for banks handling highly sensitive customer records."
  },
  {
    id: 2,
    section: "Section A: 1-mark questions",
    title: "Choosing a service model",
    text: "A company wants employees to use collaboration software through a browser without managing servers or operating systems. Which service model fits best?",
    type: "single",
    marks: 1,
    negativeMarks: 0.25,
    options: [
      { id: "A", text: "IaaS" },
      { id: "B", text: "PaaS" },
      { id: "C", text: "SaaS" },
      { id: "D", text: "Type 1 virtualization" }
    ],
    correct: ["C"],
    explanation: "Software as a Service (SaaS) delivers complete, ready-to-run applications over the internet (typically via web browser). The cloud service provider manages all underlying infrastructure, operating systems, hardware, and application updates (e.g., Microsoft 365, Google Workspace, Slack)."
  },
  {
    id: 3,
    section: "Section A: 1-mark questions",
    title: "Managing festival traffic",
    text: "An online store experiences a large increase in traffic during a festival sale. Cloud resources must increase quickly and decrease after the sale. Which feature addresses this requirement?",
    type: "single",
    marks: 1,
    negativeMarks: 0.25,
    options: [
      { id: "A", text: "Rapid elasticity" },
      { id: "B", text: "Measured service" },
      { id: "C", text: "Location-independent resource pooling" },
      { id: "D", text: "Retiring an application" }
    ],
    correct: ["A"],
    explanation: "Rapid elasticity is the NIST cloud characteristic that allows computing resources to be elastically provisioned and released—often automatically—to scale outward rapidly during traffic surges (such as festival sales) and scale inward when demand returns to normal."
  },
  {
    id: 4,
    section: "Section A: 1-mark questions",
    title: "Sharing infrastructure between government departments",
    text: "Several government departments with common requirements want to share cloud infrastructure under collaborative governance. Which deployment model should they consider?",
    type: "single",
    marks: 1,
    negativeMarks: 0.25,
    options: [
      { id: "A", text: "Public cloud" },
      { id: "B", text: "Private cloud" },
      { id: "C", text: "Hybrid cloud" },
      { id: "D", text: "Community cloud" }
    ],
    correct: ["D"],
    explanation: "A Community Cloud is provisioned for exclusive use by a specific community of consumer organizations that share common missions, security requirements, policies, and regulatory compliance considerations, operating under collaborative governance."
  },
  {
    id: 5,
    section: "Section A: 1-mark questions",
    title: "Migrating with minimal changes",
    text: "An organization wants to move an existing application to the cloud quickly without significantly changing its implementation. Which migration strategy applies?",
    type: "single",
    marks: 1,
    negativeMarks: 0.25,
    options: [
      { id: "A", text: "Re-architect" },
      { id: "B", text: "Re-host" },
      { id: "C", text: "Retire" },
      { id: "D", text: "Refactor" }
    ],
    correct: ["B"],
    explanation: "Re-host (commonly referred to as 'Lift and Shift') involves moving applications from on-premises data centers to cloud virtual machines without modifying their core application code or underlying architecture, enabling fast migration with minimal changes."
  },
  {
    id: 6,
    section: "Section A: 1-mark questions",
    title: "Running virtual machines",
    text: "A physical server must host multiple virtual machines, and a component must manage their allocation of hardware resources. What is that component?",
    type: "single",
    marks: 1,
    negativeMarks: 0.25,
    options: [
      { id: "A", text: "Dockerfile" },
      { id: "B", text: "CI/CD pipeline" },
      { id: "C", text: "Hypervisor" },
      { id: "D", text: "Serverless function" }
    ],
    correct: ["C"],
    explanation: "A Hypervisor (Virtual Machine Monitor / VMM) is the software, firmware, or hardware layer responsible for creating, running, and isolating virtual machines, managing their allocation of physical hardware resources such as CPU, memory, and storage."
  },
  {
    id: 7,
    section: "Section A: 1-mark questions",
    title: "Packaging an application",
    text: "A developer packages an application and its required libraries so it can start quickly and run consistently across environments. Which technology is being used?",
    type: "single",
    marks: 1,
    negativeMarks: 0.25,
    options: [
      { id: "A", text: "Containerization" },
      { id: "B", text: "Community cloud" },
      { id: "C", text: "Traditional data center" },
      { id: "D", text: "Cloud cost estimation" }
    ],
    correct: ["A"],
    explanation: "Containerization (e.g., Docker) bundles application code alongside all its dependencies, system libraries, and runtime configurations into a portable container image, ensuring rapid start-up and consistent execution across different environments."
  },
  {
    id: 8,
    section: "Section A: 1-mark questions",
    title: "Processing a request on demand",
    text: "A function must execute when a request arrives. The company prefers not to manage servers and wants usage-based billing. Which approach is most appropriate?",
    type: "single",
    marks: 1,
    negativeMarks: 0.25,
    options: [
      { id: "A", text: "A permanently running physical server" },
      { id: "B", text: "Manual provisioning" },
      { id: "C", text: "A dedicated traditional data center" },
      { id: "D", text: "Serverless computing" }
    ],
    correct: ["D"],
    explanation: "Serverless computing (Function-as-a-Service / FaaS, such as AWS Lambda, Azure Functions, Google Cloud Functions) executes code strictly in response to incoming events or requests, scaling automatically with zero server maintenance and billing purely for active runtime."
  },
  {
    id: 9,
    section: "Section A: 1-mark questions",
    title: "Protecting transmitted information",
    text: "An application sends confidential data to a cloud service over a network. Which measure directly protects data while it is moving?",
    type: "single",
    marks: 1,
    negativeMarks: 0.25,
    options: [
      { id: "A", text: "Increasing CPU capacity" },
      { id: "B", text: "Encrypting data in transit" },
      { id: "C", text: "Retiring the application" },
      { id: "D", text: "Installing a container orchestrator" }
    ],
    correct: ["B"],
    explanation: "Encrypting data in transit (using protocols like TLS/HTTPS, SSL, and IPsec VPNs) directly secures data while it travels over networks between clients and cloud endpoints, preventing eavesdropping and unauthorized interception."
  },
  {
    id: 10,
    section: "Section A: 1-mark questions",
    title: "Selecting the virtualization type",
    text: "A hypervisor runs directly on physical hardware without a host operating system beneath it. Which type is this?",
    type: "single",
    marks: 1,
    negativeMarks: 0.25,
    options: [
      { id: "A", text: "Type 2" },
      { id: "B", text: "Serverless" },
      { id: "C", text: "Type 1" },
      { id: "D", text: "SaaS" }
    ],
    correct: ["C"],
    explanation: "Type 1 hypervisors (bare-metal hypervisors, such as VMware ESXi, KVM, Microsoft Hyper-V) run directly on physical server hardware without an underlying host operating system, offering direct hardware control, superior performance, and low latency."
  },
  {
    id: 11,
    section: "Section A: 1-mark questions",
    title: "Choosing an architecture",
    text: "A service remembers previous client interactions and maintains session information between requests. What is this architecture called?",
    type: "single",
    marks: 1,
    negativeMarks: 0.25,
    options: [
      { id: "A", text: "Stateful" },
      { id: "B", text: "Stateless" },
      { id: "C", text: "Serverless" },
      { id: "D", text: "Poly-cloud" }
    ],
    correct: ["A"],
    explanation: "A stateful architecture keeps track of client session state and remembers context from previous interactions across sequential requests. In contrast, stateless architectures require each request to contain all necessary context independently."
  },
  {
    id: 12,
    section: "Section A: 1-mark questions",
    title: "Discontinuing an unused application",
    text: "A company discovers that a legacy application is no longer required and decides not to migrate it. Which strategy applies?",
    type: "single",
    marks: 1,
    negativeMarks: 0.25,
    options: [
      { id: "A", text: "Retain" },
      { id: "B", text: "Re-platform" },
      { id: "C", text: "Re-host" },
      { id: "D", text: "Retire" }
    ],
    correct: ["D"],
    explanation: "The 'Retire' migration strategy identifies redundant, unneeded, or obsolete applications during the discovery phase and completely decommissions them, saving maintenance, licensing, and operational costs."
  },
  {
    id: 13,
    section: "Section A: 1-mark questions",
    title: "Automating software delivery",
    text: "A development team wants code changes to trigger an automated process for building, testing and preparing software releases. Which practice best fits?",
    type: "single",
    marks: 1,
    negativeMarks: 0.25,
    options: [
      { id: "A", text: "Cloud bursting" },
      { id: "B", text: "CI/CD" },
      { id: "C", text: "Data center provisioning" },
      { id: "D", text: "Re-hosting" }
    ],
    correct: ["B"],
    explanation: "CI/CD (Continuous Integration and Continuous Delivery / Deployment) establishes automated delivery pipelines where code commits trigger automatic building, testing, integration, and release artifact generation."
  },
  {
    id: 14,
    section: "Section A: 1-mark questions",
    title: "Processing data near its source",
    text: "A factory needs to process sensor readings near its machines to detect overheating quickly. Which technology best meets this requirement?",
    type: "single",
    marks: 1,
    negativeMarks: 0.25,
    options: [
      { id: "A", text: "SaaS" },
      { id: "B", text: "Public cloud only" },
      { id: "C", text: "Edge computing" },
      { id: "D", text: "Cloud cost estimation" }
    ],
    correct: ["C"],
    explanation: "Edge computing processes and analyzes data near the physical devices or sensors where it is generated, drastically reducing network round-trip latency to enable instant real-time alerts for critical conditions like machine overheating."
  },
  {
    id: 15,
    section: "Section A: 1-mark questions",
    title: "Understanding cloud responsibility",
    text: "The provider protects its physical data center, while the customer configures permissions for a cloud database. Who is responsible for configuring those customer access permissions?",
    type: "single",
    marks: 1,
    negativeMarks: 0.25,
    options: [
      { id: "A", text: "The customer" },
      { id: "B", text: "Only the provider" },
      { id: "C", text: "The hardware manufacturer" },
      { id: "D", text: "The container orchestrator" }
    ],
    correct: ["A"],
    explanation: "Under the Shared Responsibility Model, the cloud service provider (CSP) manages 'security OF the cloud' (physical facilities, hardware, foundational hypervisor), whereas the customer is strictly responsible for 'security IN the cloud', including customer IAM access control, database user permissions, and data encryption."
  },
  {
    id: 16,
    section: "Section A: 1-mark questions",
    title: "Identifying a specialized cloud arrangement",
    text: "A company chooses one provider for analytics, another for machine learning and another for reporting, based on each service's strengths. Which concept best describes this?",
    type: "single",
    marks: 1,
    negativeMarks: 0.25,
    options: [
      { id: "A", text: "Hybrid cloud" },
      { id: "B", text: "Type 1 virtualization" },
      { id: "C", text: "Traditional data center" },
      { id: "D", text: "Poly-cloud" }
    ],
    correct: ["D"],
    explanation: "Poly-cloud is a specialized multi-cloud architectural approach where an organization strategically uses best-of-breed specialized services from different cloud providers to leverage each provider's distinct functional strengths (e.g., Google BigQuery for analytics, AWS SageMaker for ML, Azure Power BI for reporting)."
  },
  {
    id: 17,
    section: "Section A: 1-mark questions",
    title: "Discovering migration requirements",
    text: "Before planning a migration, a company must identify its servers, applications, capacity utilization and application characteristics. Which migration phase comes first?",
    type: "single",
    marks: 1,
    negativeMarks: 0.25,
    options: [
      { id: "A", text: "Deploy" },
      { id: "B", text: "Discovery" },
      { id: "C", text: "Handover" },
      { id: "D", text: "Retire" }
    ],
    correct: ["B"],
    explanation: "The Discovery (and Assessment) phase is the initial foundational stage of cloud migration. It inventories existing servers, databases, dependencies, resource utilization, and application profiles to formulate an effective migration plan."
  },
  {
    id: 18,
    section: "Section A: 1-mark questions",
    title: "Protecting access to cloud resources",
    text: "A company wants to define security rules, determine who may access resources, and review activities. Which combination of cloud security features best supports these objectives?",
    type: "multiple",
    marks: 1,
    negativeMarks: 0.25,
    options: [
      { id: "A", text: "Organization policies and access control" },
      { id: "B", text: "Retiring and re-hosting" }
    ],
    correct: ["A"],
    explanation: "Organization policies and access controls (such as IAM policies, role-based access control, and audit logging) directly enforce resource boundaries, govern who has access, and provide visibility into activities. In contrast, retiring and re-hosting are application migration strategies, not security access features."
  },

  // SECTION B: 2-mark questions (Q19 - Q23)
  {
    id: 19,
    section: "Section B: 2-mark questions",
    title: "Choosing a cloud design for sensitive workloads",
    text: "A healthcare organization wants to keep sensitive records in a controlled environment while using public cloud capacity for less-sensitive workloads during demand spikes. Which design best fits?",
    type: "single",
    marks: 2,
    negativeMarks: 0.50,
    options: [
      { id: "A", text: "Public cloud exclusively" },
      { id: "B", text: "Community cloud exclusively" },
      { id: "C", text: "Hybrid cloud" },
      { id: "D", text: "Re-hosting without changing the deployment model" }
    ],
    correct: ["C"],
    explanation: "A Hybrid Cloud seamlessly unifies private infrastructure (maintaining strict compliance and security for sensitive patient medical records) with public cloud infrastructure, enabling 'cloud bursting' and elastic compute capacity for non-sensitive public workloads during demand spikes."
  },
  {
    id: 20,
    section: "Section B: 2-mark questions",
    title: "Identifying the correct migration strategy",
    text: "A company is migrating two applications. Application A needs some platform-level changes, while Application B requires its architecture to be redesigned for cloud requirements. Which mapping is correct?",
    type: "single",
    marks: 2,
    negativeMarks: 0.50,
    options: [
      { id: "A", text: "A — Re-host; B — Retain" },
      { id: "B", text: "A — Retire; B — Re-platform" },
      { id: "C", text: "A — Re-architect; B — Re-host" },
      { id: "D", text: "A — Re-platform; B — Re-architect" }
    ],
    correct: ["D"],
    explanation: "Re-platforming ('lift, tinker, and shift') involves making platform-level optimizations (such as upgrading database versions or adopting managed cloud databases) without restructuring core application logic. Re-architecting completely redesigns and rewrites application architecture to leverage cloud-native features."
  },
  {
    id: 21,
    section: "Section B: 2-mark questions",
    title: "Choosing between containers and VMs",
    text: "A development team needs lightweight deployments that start quickly, bundle dependencies and share the host OS kernel. Which statements match its requirements?",
    type: "multiple",
    marks: 2,
    negativeMarks: 0.50,
    options: [
      { id: "A", text: "Containers can package application dependencies." },
      { id: "B", text: "Every container must have its own complete guest OS." }
    ],
    correct: ["A"],
    explanation: "Containers package applications along with their dependencies and share the underlying host OS kernel, making them lightweight and fast to start. Virtual machines require their own complete guest operating system, whereas containers do not."
  },
  {
    id: 22,
    section: "Section B: 2-mark questions",
    title: "Assessing migration costs",
    text: "A company wants to estimate the total cost of moving an application to the cloud. It must account for usage, management, transition and lifecycle costs. Which actions should the team take?",
    type: "multiple",
    marks: 2,
    negativeMarks: 0.50,
    options: [
      { id: "A", text: "Ignore management and transition costs because the cloud is pay-as-you-go." },
      { id: "B", text: "Evaluate usage patterns and consider the full total cost of ownership." }
    ],
    correct: ["B"],
    explanation: "Accurately calculating migration expenses requires assessing Total Cost of Ownership (TCO), accounting for workload consumption, transition migration costs, workforce training, and management overhead. Pay-as-you-go pricing does not eliminate management or transition costs."
  },
  {
    id: 23,
    section: "Section B: 2-mark questions",
    title: "Improving software delivery security",
    text: "A company wants automated builds and tests, with security checks integrated throughout development and operations instead of only after deployment. Which practices best fit?",
    type: "multiple",
    marks: 2,
    negativeMarks: 0.50,
    options: [
      { id: "A", text: "DevSecOps and CI/CD" },
      { id: "B", text: "Manual security review only after production release" }
    ],
    correct: ["A"],
    explanation: "DevSecOps 'shifts security left' by embedding automated security scanning, vulnerability tests, and compliance checks directly into the continuous integration and delivery (CI/CD) pipeline. Postponing reviews until manual production release creates critical bottlenecks and security risks."
  },

  // SECTION C: 3-mark questions (Q24 - Q27)
  {
    id: 24,
    section: "Section C: 3-mark questions",
    title: "Selecting a complete cloud migration plan",
    text: "An organization has several applications. Some must move quickly with minimal changes, some require platform-level adjustments, one needs an architectural redesign, and another is no longer needed. Which statements correctly match the migration strategies to the requirements?",
    type: "multiple",
    marks: 3,
    negativeMarks: 0.75,
    options: [
      { id: "A", text: "Re-host for minimal changes; re-platform for platform-level changes; re-architect for a redesigned architecture." },
      { id: "B", text: "Retire the application that is no longer required rather than migrating it." }
    ],
    correct: ["A", "B"],
    explanation: "Both statements correctly reflect the migration 6-Rs taxonomy: Re-host pairs with minimal changes, Re-platform with platform adjustments, and Re-architect with architectural redesign. Retiring is the correct strategy for applications that are no longer needed."
  },
  {
    id: 25,
    section: "Section C: 3-mark questions",
    title: "Investigating a cloud security incident",
    text: "A company discovers publicly accessible cloud storage, excessive employee permissions and insufficient activity reviews. The provider is already protecting the physical infrastructure. Which responses address the customer's responsibilities?",
    type: "multiple",
    marks: 3,
    negativeMarks: 0.75,
    options: [
      { id: "A", text: "Configure appropriate access controls and secure the cloud data." },
      { id: "B", text: "Rely entirely on the provider's physical security and make no customer-side changes." }
    ],
    correct: ["A"],
    explanation: "Configuring appropriate IAM access controls and securing storage buckets are fundamental customer responsibilities under the Shared Responsibility Model. Cloud provider physical facility security does not protect against misconfigured cloud bucket access or overprivileged customer permissions."
  },
  {
    id: 26,
    section: "Section C: 3-mark questions",
    title: "Modernizing a high-traffic application",
    text: "An organization needs independently deployable services, frequent software releases, integrated security checks and rapid handling of events generated near factory machines. Which combination best fits the requirements?",
    type: "multiple",
    marks: 3,
    negativeMarks: 0.75,
    options: [
      { id: "A", text: "Microservices with DevSecOps and CI/CD" },
      { id: "B", text: "Edge computing for events that need processing near their source" }
    ],
    correct: ["A", "B"],
    explanation: "Both statements accurately address the requirements: Microservices with DevSecOps and CI/CD enable independently deployable components, rapid releases, and continuous security checks; Edge computing delivers the low-latency processing needed for real-time factory machine events near their source."
  },
  {
    id: 27,
    section: "Section C: 3-mark questions",
    title: "Choosing a resilient cloud strategy",
    text: "A business wants to reduce dependence on one cloud provider and select specialized services from different providers. It also wants to maintain sensitive workloads in a private environment while using public capacity during demand spikes. Which statements correctly describe the solution?",
    type: "multiple",
    marks: 3,
    negativeMarks: 0.75,
    options: [
      { id: "A", text: "Multi-cloud and poly-cloud can support provider flexibility and specialized service selection." },
      { id: "B", text: "A hybrid cloud can combine private and public environments to support these workload requirements." }
    ],
    correct: ["A", "B"],
    explanation: "Both statements correctly describe the comprehensive solution: Multi-cloud and poly-cloud avoid vendor lock-in and select specialized cloud services across providers; Hybrid cloud connects private infrastructure for sensitive data with public cloud bursts for demand spikes."
  }
];
