import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ArgumentsSource;

/**
 * Аннотация для автоматического запуска тестов в разных браузерах.
 * Заменяет повторяющийся код настройки и инициализации WebDriver.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@ExtendWith(WebDriverExtension.class)
@ParameterizedTest
@ArgumentsSource(BrowserArgumentProvider.class)
public @interface AutoBrowser {
    /**
     * Имя теста для отображения в отчетах.
     */
    String name() default "[{index}] {arguments}";
    
    /**
     * Браузеры, в которых будет выполняться тест.
     * Если массив пустой, тест будет выполнен во всех браузерах.
     */
    Browser[] value() default {};
    
    /**
     * Указывает, что тест должен выполняться во всех браузерах, кроме перечисленных.
     */
    boolean exclude() default false;
    
    /**
     * URL, который будет открыт автоматически перед тестом.
     * Если пустой, URL не будет открыт автоматически.
     */
    String url() default "";
}