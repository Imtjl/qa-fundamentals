import java.lang.reflect.Method;
import java.util.Optional;

import org.junit.jupiter.api.extension.BeforeTestExecutionCallback;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.openqa.selenium.WebDriver;

/**
 * JUnit расширение, которое автоматически настраивает WebDriver
 * перед выполнением тестов с аннотацией @AutoBrowser.
 */
public class WebDriverExtension implements BeforeTestExecutionCallback {
    
    @Override
    public void beforeTestExecution(ExtensionContext context) throws Exception {
        Object testInstance = context.getRequiredTestInstance();
        Optional<Method> testMethod = context.getTestMethod();
        
        if (testInstance instanceof BaseBrowserTestI && testMethod.isPresent()) {
            BaseBrowserTestI test = (BaseBrowserTestI) testInstance;
            Method method = testMethod.get();
            
            AutoBrowser annotation = method.getAnnotation(AutoBrowser.class);
            if (annotation != null) {
                String displayName = context.getDisplayName();
                Browser browser = null;
                
                if (displayName.contains("CHROME")) {
                    browser = Browser.CHROME;
                } else if (displayName.contains("FIREFOX")) {
                    browser = Browser.FIREFOX;
                } else if (displayName.contains("EDGE")) {
                    browser = Browser.EDGE;
                }
                
                if (browser != null) {
                    WebDriver driver = test.setupDriver(browser);
                    
                    if (driver != null) {
                        String url = annotation.url();
                        if (url != null && !url.isEmpty()) {
                            driver.get(url);
                        } else if (test.getBaseUrl() != null && !test.getBaseUrl().isEmpty()) {
                            driver.get(test.getBaseUrl());
                        }
                    }
                }
            }
        }
    }
}