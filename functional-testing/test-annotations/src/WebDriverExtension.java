import java.lang.reflect.Method;
import java.util.Optional;

import org.junit.jupiter.api.extension.AfterEachCallback;
import org.junit.jupiter.api.extension.BeforeEachCallback;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.openqa.selenium.WebDriver;

/**
 * JUnit расширение, которое автоматически настраивает WebDriver
 * на основе аннотации @AutoBrowser.
 */
public class WebDriverExtension implements BeforeEachCallback, AfterEachCallback {
    
    @Override
    public void beforeEach(ExtensionContext context) throws Exception {
        // Получаем тестовый класс и метод
        Object testInstance = context.getRequiredTestInstance();
        Optional<Method> testMethod = context.getTestMethod();
        
        if (testInstance instanceof BaseBrowserTestI && testMethod.isPresent()) {
            BaseBrowserTestI test = (BaseBrowserTestI) testInstance;
            Method method = testMethod.get();
            
            // Проверяем наличие нашей аннотации
            AutoBrowser annotation = method.getAnnotation(AutoBrowser.class);
            if (annotation != null) {
                // Получаем параметры из контекста теста
                Object[] parameters = context.getStore(ExtensionContext.Namespace.create(context.getUniqueId()))
                    .get("arguments", Object[].class);
                
                if (parameters != null && parameters.length > 0 && parameters[0] instanceof Browser) {
                    Browser browser = (Browser) parameters[0];
                    
                    // Создаем и настраиваем WebDriver
                    WebDriver driver = test.setupDriver(browser);
                    
                    // Если указан URL, открываем его
                    String url = annotation.url();
                    if (!url.isEmpty()) {
                        driver.get(url);
                    } else if (test.getBaseUrl() != null && !test.getBaseUrl().isEmpty()) {
                        // Если URL не указан, но есть базовый URL, открываем его
                        driver.get(test.getBaseUrl());
                    }
                }
            }
        }
    }
    
    @Override
    public void afterEach(ExtensionContext context) throws Exception {
        Object testInstance = context.getRequiredTestInstance();
        if (testInstance instanceof BaseBrowserTestI) {
            BaseBrowserTestI test = (BaseBrowserTestI) testInstance;
            
            // Закрываем браузер
            test.tearDown();
        }
    }
}