package com.nature.base.config;

import com.nature.base.util.LoggerUtil;
import com.nature.base.util.SpringContextUtil;
import com.nature.base.vo.UserVo;
import com.nature.common.Eunm.SysRoleType;
import com.nature.component.sysUser.model.SysRole;
import com.nature.component.sysUser.model.SysUser;
import com.nature.mapper.sysUser.SysUserMapper;
import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

import javax.annotation.Resource;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Configurable
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)//允许进入页面方法前检验
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    /**
     * Introducing logs, note that they are all packaged under "org.slf4j"
     */
    Logger logger = LoggerUtil.getLogger();

    @Resource
    private SysUserMapper sysUserMapper;

    @Override
    public void configure(WebSecurity web) throws Exception {
        //解决静态资源被拦截的问题
        web.ignoring().antMatchers("/charisma/**", "/bootstrap/**", "/js/**", "/css/**", "/custom/css/**", "/img/**", "/img/*");
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService()).passwordEncoder(new BCryptPasswordEncoder());//添加自定义的userDetailsService认证
        auth.eraseCredentials(false);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers("/").permitAll()
                .antMatchers("/register").permitAll()
                .antMatchers("/checkUserName").permitAll()
                .anyRequest()//all others request authentication
                .authenticated()
                .and()
                .formLogin().loginPage("/login").permitAll().successHandler(loginSuccessHandler())
                .and()
                .logout()
                .logoutUrl("/logout")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID").logoutSuccessHandler(logoutSuccessHandler());
    }

    @Bean
    public SavedRequestAwareAuthenticationSuccessHandler loginSuccessHandler() { //登入处理
        return new SavedRequestAwareAuthenticationSuccessHandler() {
            @Override
            public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
                UserVo userDetails = (UserVo) authentication.getPrincipal();
                logger.info("USER : " + userDetails.getUsername() + " LOGIN SUCCESS !  ");
                super.onAuthenticationSuccess(request, response, authentication);
            }
        };
    }

    @Bean
    public LogoutSuccessHandler logoutSuccessHandler() { //登出处理
        return new LogoutSuccessHandler() {
            @Override
            public void onLogoutSuccess(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Authentication authentication) throws IOException, ServletException {
                try {
                    UserVo userVo = (UserVo) authentication.getPrincipal();
                    logger.info("USER : " + userVo.getUsername() + " LOGOUT SUCCESS !  ");
                } catch (Exception e) {
                    logger.error("LOGOUT EXCEPTION , e : ", e);
                }
                httpServletResponse.sendRedirect("/piflow-web/login");
            }
        };
    }

    @Bean
    public UserDetailsService userDetailsService() {    //用户登录实现
        return new UserDetailsService() {

            UserVo getUserDetails(String username) {
                UserVo userVo = null;
                if (null == sysUserMapper) {
                    sysUserMapper = (SysUserMapper) SpringContextUtil.getBean("sysUserMapper");
                }
                SysUser sysUser = sysUserMapper.findUserByUserName(username);
                String password = "";
                if (null != sysUser) {
                    userVo = new UserVo();
                    password = sysUser.getPassword();
                    userVo.setUsername(sysUser.getUsername());
                    userVo.setPassword(sysUser.getPassword());
                    userVo.setName(sysUser.getName());
                    userVo.setAge(sysUser.getAge());
                    List<SysRole> sysRoleTypes = sysUser.getRoles();
                    userVo.setRoles(sysRoleTypes);
                    if (CollectionUtils.isNotEmpty(sysRoleTypes)) {
                        String[] valueArray = new String[sysRoleTypes.size()];
                        for (int i = 0; i < sysRoleTypes.size(); i++) {
                            SysRole sysRole = sysRoleTypes.get(i);
                            if (null != sysRole && null != sysRole.getRole()) {
                                valueArray[i] = sysRole.getRole().getValue();
                            }
                        }
                        if (valueArray.length > 0) {
                            userVo.setAuthorities(AuthorityUtils.createAuthorityList(valueArray));
                        }
                    }
                }
                return userVo;
            }

            @Override
            public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
                UserVo user = getUserDetails(username);
                if (user == null) {
                    throw new UsernameNotFoundException("Username " + username + " not found");
                }
                return user;
            }
        };
    }

}
