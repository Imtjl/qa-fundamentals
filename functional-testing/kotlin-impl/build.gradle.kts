plugins {
    kotlin("jvm") version "1.9.0"
    java
    id("io.gitlab.arturbosch.detekt") version ("1.23.8")
    id("com.ncorti.ktfmt.gradle") version "0.22.0"
    idea
}

repositories { mavenCentral() }

sourceSets { test { kotlin { srcDirs("tests") } } }

dependencies {
    implementation("org.seleniumhq.selenium:selenium-java:4.15.0")
    implementation("io.github.bonigarcia:webdrivermanager:5.6.0")
    implementation("com.opera:operadriver:1.5")
    implementation(kotlin("stdlib"))
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.0")
}

tasks.test {
    useJUnitPlatform()
    testLogging { events("passed", "skipped", "failed") }
}

detekt {
    config = files("${projectDir}/config/detekt.yml")
    buildUponDefaultConfig = true
}

ktfmt {
    kotlinLangStyle()
    maxWidth.set(80)
    removeUnusedImports.set(false)
    manageTrailingCommas.set(true)
}
