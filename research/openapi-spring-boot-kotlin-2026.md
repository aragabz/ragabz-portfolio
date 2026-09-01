# OpenAPI in Spring Boot/Kotlin Projects — State of the Art (2026)

## 1. The Three Main Approaches

### 1.1 Code-First (Generate Spec from Code)

Write Spring Boot controllers and DTOs with annotations, then auto-generate the OpenAPI spec at runtime or build time.

**Primary tool:** `springdoc-openapi`

```
// kotlin
@RestController
@RequestMapping("/api/v1/products")
@Tag(name = "Product API")
class ProductController {

    @Operation(summary = "Get a product by ID")
    @GetMapping("/{id}")
    fun getProduct(@PathVariable id: String): ResponseEntity<Product> = ...
}
```

- Add dependency → Swagger UI + `/v3/api-docs` appear automatically
- Spec is derived from annotations + code introspection
- No separate YAML file to maintain

### 1.2 Spec-First (Generate Code from Spec)

Write an `openapi.yaml` first, then generate server stubs, DTOs, and interfaces.

**Primary tool:** `openapi-generator` (kotlin-spring generator)

```yaml
openapi: 3.1.0
info:
  title: Product API
  version: 1.0.0
paths:
  /api/v1/products/{id}:
    get:
      operationId: getProduct
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Product found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Product'
```

- Generates Kotlin interfaces, data classes, and Spring controller stubs
- Implement the generated interface with business logic
- Spec is the single source of truth

### 1.3 Hybrid / Spec-First with Minimal Code Generation

Use OpenAPI Generator with `interfaceOnly=true` (generates only interfaces, not full controllers), or use springdoc for runtime spec + build-time spec export for contract testing.

**Tools:**
- `openapi-generator-maven-plugin` / `openapi-generator-gradle-plugin` with `interfaceOnly=true`
- `springdoc-openapi-maven-plugin` for build-time spec export
- Stoplight Prism / Schemathesis for contract validation

---

## 2. Popular Tools & Libraries (Current Versions, Aug 2026)

### Code-First

| Library | Latest Version | Spring Boot Support | Notes |
|---------|---------------|-------------------|-------|
| `springdoc-openapi-starter-webmvc-ui` | **2.8.17** (SB 3.x) / **3.1.0** (SB 4.x) | Boot 3.x, 4.x | De facto standard. 300M+ downloads/month. |
| `springdoc-openapi-starter-webflux-ui` | 2.8.17 / 3.1.0 | Boot 3.x, 4.x | Reactive support |
| `springdoc-openapi-starter-common` | 2.8.5+ | Boot 3.x | Enhanced Kotlin type support |
| `springdoc-openapi-maven-plugin` | 1.5 | Any | Build-time spec export from running app |
| `springdoc-openapi-gradle-plugin` | — | Any | Gradle equivalent |
| `io.swagger.v3.oas.annotations` | 2.2.x | Any | Underlying annotation library |

**Version matrix:**
- Spring Boot 2.x → springdoc-openapi **v1.x** (latest: 1.8.0, now EOL)
- Spring Boot 3.x → springdoc-openapi **v2.x** (latest: 2.8.17)
- Spring Boot 4.x → springdoc-openapi **v3.x** (latest: 3.1.0, released Aug 2026)

### Spec-First

| Library | Latest Version | Notes |
|---------|---------------|-------|
| `openapi-generator` | **7.14.0** (approx) | 50+ generators including `kotlin-spring` |
| `openapi-generator-maven-plugin` | 7.14.0 | Maven integration |
| `openapi-generator-gradle-plugin` | 7.14.0 | Gradle integration |
| `swagger-codegen` | 3.x (legacy) | Older, less maintained than openapi-generator |
| `swagger-core` | 2.2.52 | Underlying library used by springdoc |

**Key `kotlin-spring` generator options:**
- `interfaceOnly=true` — Generate only interfaces (most common for Spring Boot)
- `delegatePattern=true` — Generate delegate classes for separation of concerns
- `useSpringBoot3=true` / `useSpringBoot4=true` — Jakarta namespace support
- `library=spring-boot` — Spring Boot specific templates
- `dateLibrary=java8` — Java 8+ date types

### Hybrid / Contract Testing

| Tool | Purpose |
|------|---------|
| Stoplight Prism | Mock server from OpenAPI spec |
| Schemathesis | Fuzz testing against OpenAPI spec |
| Spectral | Linting / style rules for OpenAPI specs |
| oasdiff | Breaking change detection between spec versions |
| `restdocs-api-spec` | Generate OpenAPI from Spring REST Docs tests |

---

## 3. Pros and Cons

### Code-First (springdoc-openapi)

**Pros:**
- Lowest friction — add one dependency and you have docs
- Familiar Spring developer workflow (annotations, not YAML)
- IDE refactoring support (rename method → spec updates)
- Single source of truth (code) — no spec drift from forgotten YAML edits
- Excellent Kotlin support (data classes, nullable types, value classes)
- Rich annotation set: `@Operation`, `@Schema`, `@Parameter`, `@Tag`, `@SecurityScheme`
- Build-time spec export via Maven/Gradle plugins
- Supports OpenAPI 3.1 (since v2.8.0)

**Cons:**
- Spec quality depends on developer discipline adding annotations
- Annotation clutter can obscure business logic in controllers
- No upfront contract review before implementation
- Runtime generation adds startup overhead (mitigated by build-time plugins)
- Harder to share contract with non-Java teams before code exists
- Spec can silently drift from actual behavior

### Spec-First (openapi-generator)

**Pros:**
- Contract is the source of truth — enforced by generation
- Parallel development: frontend/QA/backend work from agreed spec
- Client SDK generation from the same spec (TypeScript, Kotlin, etc.)
- Mock servers from spec (Stoplight Prism)
- Clean separation of contract from implementation
- No runtime overhead for spec generation
- Formal contract review via PR on YAML files
- Breaking change detection (oasdiff, Spectral)

**Cons:**
- Upfront design effort — requires writing YAML before code
- Generated code can be ugly/hard to debug
- Learning curve for OpenAPI spec syntax and generator config
- Changes require spec update → regenerate → implement (extra steps)
- `kotlin-spring` generator produces Java-style code (not idiomatic Kotlin)
- Template customization needed for Kotlin data classes vs Java POJOs
- Two sources of truth risk if generated code is heavily modified

### Hybrid

**Pros:**
- Best of both worlds: spec as contract + code-driven docs
- `interfaceOnly=true` generates interfaces without full controllers
- Can validate implementation matches spec in CI
- Build-time spec export from springdoc for contract testing

**Cons:**
- More tooling complexity
- Requires discipline to keep spec and code in sync
- CI pipeline needs to run contract tests

---

## 4. Current Best Practices & Recommendations (2026)

### For New Projects

**Recommended approach: Spec-First with `openapi-generator`**

```kotlin
// build.gradle.kts
plugins {
    id("org.openapi.generator") version "7.14.0"
}

openApiGenerate {
    generatorName.set("kotlin-spring")
    inputSpec.set("$rootDir/src/main/resources/openapi/api.yaml")
    outputDir.set("$buildDir/generated/openapi")
    configOptions.set(mapOf(
        "interfaceOnly" to "true",
        "useSpringBoot3" to "true",
        "dateLibrary" to "java8",
        "library" to "spring-boot",
        "useTags" to "true"
    ))
}

tasks.named("compileKotlin") {
    dependsOn("openApiGenerate")
}

sourceSets.main {
    java.srcDir("$buildDir/generated/openapi/src/main/kotlin")
}
```

**Workflow:**
1. Write `openapi.yaml` with all endpoints, schemas, and examples
2. Run Spectral linting in CI to enforce style
3. Review spec with frontend/QA stakeholders
4. Generate Kotlin interfaces + data classes at build time
5. Implement generated interfaces with business logic
6. Use Stoplight Prism for mock server during frontend development
7. Run Schemathesis in CI for contract validation
8. Use oasdiff for breaking change detection on PRs

### For Existing Spring Boot Projects

**Recommended approach: Code-First with `springdoc-openapi`**

```kotlin
// build.gradle.kts
dependencies {
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.17")
}

// application.yml
springdoc:
  api-docs:
    path: /v3/api-docs
  swagger-ui:
    path: /swagger-ui.html
  packages-to-scan: com.example.api
```

**Then add build-time spec export:**

```xml
<!-- pom.xml -->
<plugin>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-maven-plugin</artifactId>
    <version>1.5</version>
    <executions>
        <execution>
            <id>integration-test</id>
            <goals><goal>generate</goal></goals>
        </execution>
    </executions>
    <configuration>
        <apiDocsUrl>http://localhost:8080/v3/api-docs</apiDocsUrl>
        <outputFileName>openapi.json</outputFileName>
        <outputDir>${project.build.directory}</outputDir>
    </configuration>
</plugin>
```

### For Public/External APIs

**Mandatory: Spec-First**

- External APIs need a stable contract that doesn't depend on implementation language
- Use spec-first to enable multi-language client SDK generation
- Enforce backward compatibility with oasdiff in CI
- Version the spec independently of the implementation

### For Internal Microservices

**Either approach works, but:**

- If consumers are in the same org and same language → code-first is faster
- If consumers are polyglot or cross-team → spec-first is safer
- Consider `interfaceOnly=true` hybrid for middle ground

---

## 5. Real-World Examples

### Example 1: Code-First Spring Boot + Kotlin (Common Pattern)

```kotlin
@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "Users", description = "User management")
class UserController(private val userService: UserService) {

    @Operation(
        summary = "Get user by ID",
        responses = [
            ApiResponse(responseCode = "200", description = "User found"),
            ApiResponse(responseCode = "404", description = "User not found")
        ]
    )
    @GetMapping("/{id}")
    suspend fun getUser(
        @Parameter(description = "User ID", required = true)
        @PathVariable id: String
    ): ResponseEntity<UserDto> = userService.findById(id)
        ?.let { ResponseEntity.ok(it) }
        ?: ResponseEntity.notFound().build()
}

data class UserDto(
    @field:Schema(description = "Unique identifier", example = "usr_123")
    val id: String,
    @field:Schema(description = "User email", example = "user@example.com")
    val email: String
)
```

### Example 2: Spec-First with openapi-generator (Baeldung Example)

```yaml
# car-spec.yaml
openapi: 3.0.3
info:
  title: Car API
  version: 1.0.0
paths:
  /cars:
    get:
      operationId: getCars
      responses:
        '200':
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Car'
components:
  schemas:
    Car:
      type: object
      properties:
        id: { type: integer }
        make: { type: string }
        model: { type: string }
```

```xml
<!-- pom.xml -->
<plugin>
    <groupId>org.openapitools</groupId>
    <artifactId>openapi-generator-maven-plugin</artifactId>
    <version>7.6.0</version>
    <executions>
        <execution>
            <goals><goal>generate</goal></goals>
            <configuration>
                <inputSpec>${basedir}/src/main/resources/car-spec.yaml</inputSpec>
                <generatorName>kotlin-spring</generatorName>
                <packageName>com.example.openapi.car</packageName>
                <output>${project.build.directory}/generated-oas</output>
                <configOptions>
                    <dateLibrary>java8</dateLibrary>
                    <interfaceOnly>true</interfaceOnly>
                    <useTags>true</useTags>
                </configOptions>
            </configuration>
        </execution>
    </executions>
</plugin>
```

```kotlin
// Generated interface implementation
class CarCrudController(private val carService: CarService) : CarsApi {
    override fun getCars(): ResponseEntity<List<Car>> =
        ResponseEntity.ok(carService.findAll())

    override fun getCar(id: Int): ResponseEntity<Car> =
        carService.findById(id)
            ?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()
}
```

### Example 3: Hybrid (springdoc + build-time export + contract testing)

```yaml
# CI pipeline
steps:
  - name: Build and start app
    run: ./gradlew bootRun &

  - name: Export OpenAPI spec
    run: curl -s http://localhost:8080/v3/api-docs.yaml > build/openapi-exported.yaml

  - name: Lint spec with Spectral
    run: npx @stoplight/spectral-cli lint build/openapi-exported.yaml

  - name: Check for breaking changes
    run: oasdiff breaking --base main.yaml --revision build/openapi-exported.yaml

  - name: Contract test with Schemathesis
    run: schemathesis run build/openapi-exported.yaml --base-url http://localhost:8080

  - name: Generate client for integration tests
    run: openapi-generator generate -i build/openapi-exported.yaml -g kotlin -o build/client
```

---

## 6. Key Takeaways

| Decision Factor | Recommended Approach |
|----------------|---------------------|
| New project, clean design | Spec-first (openapi-generator) |
| Existing project, need docs fast | Code-first (springdoc-openapi) |
| Public/external API | Spec-first (mandatory) |
| Internal microservices, same team | Code-first (pragmatic) |
| Internal microservices, polyglot | Spec-first |
| Need mock servers for frontend | Spec-first |
| Spring Boot 4.x | springdoc-openapi v3.x or openapi-generator |
| Kotlin idiomatic code | Code-first (better Kotlin support) |
| Contract testing in CI | Either + Schemathesis + oasdiff |

---

*Research compiled August 2026. Sources: springdoc.org, openapi-generator.tech, Baeldung, APIScout, The Main Thread, Spring I/O 2026, GitHub repos.*
