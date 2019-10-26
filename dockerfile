FROM centos:7
EXPOSE 80

RUN curl -sL https://rpm.nodesource.com/setup_10.x | bash
RUN yum -y install nodejs git

RUN yum -y install epel-release
RUN yum -y install nginx

COPY ./ ./legend-keeper/
WORKDIR ./legend-keeper/
RUN npm install
RUN npm run-script build --output-path=./dist/

RUN rm -rf /usr/share/nginx/html/*
RUN cp -a ./dist/legend-keeper/* /usr/share/nginx/html/

CMD ["nginx", "-g", "daemon off;"]
